import React, { useEffect } from 'react'
import { Graph, Addon, Shape, Edge, EdgeView, Point, Node } from '@antv/x6'
import { usePortal, ReactShape } from '@antv/x6-react-shape'
import { uuid } from '@/utils/uuid'
import { NodeGroups, Nodes } from './NodesInit'
import ChartRect from './ChartRect'
import { PortManager } from '@antv/x6/lib/model/port'
import { graphConfig, portGroupsConfig } from './graphConfig'
import { message } from 'antd';
import Root, { ArgsTypes, ArgsTypesStrs } from '@/stores/RootStore'
import { useStores } from '@/utils/useStores'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { getEnumKeysOrValue } from '@/utils/findObjectAttr'
import { SimpleNodeView } from './view'
import { buffBuilder, IEventBuffs } from '@/utils/buffMachine'
const UNIQ_GRAPH_ID = uuid() // 任意字符串，作为画布的唯一标识。注意：任意两张同时渲染的画布需要有不同的标识
export interface ISkillEdit {
  id: string
}
export interface IBluePrint {
  node: Node<Node.Properties>,
  edge: Edge<Edge.Properties>
}


export const findNextNodeAndEdge = (graph: Graph, node: Node<Node.Properties>) => {
  const nextEdge = graph.getOutgoingEdges(node)?.filter((edge) => { return edge.getProp('type') == 'exec' })
  
  if (nextEdge && nextEdge?.length != 0) {
    const nextNode = nextEdge[0].getTargetNode()
    if (nextNode) {
      const newNE: IBluePrint = { node: nextNode, edge: nextEdge[0] }
      return newNE
    }
  }
  return null
}

export const SkillEditChart = ({ id }: ISkillEdit) => {
  const [Portal, setGraph] = usePortal(UNIQ_GRAPH_ID)
  const { RootStore }: Record<string, Root> = useStores();
  var ctrlPressed = false;
  const embedPadding = 20
  const UpdateBluePrint = (graph: Graph) => {
    const nodes = graph.getNodes()
    var beginNode: Node<Node.Properties>;
    const eventBuffs: IEventBuffs[] = []
    nodes.map((node) => {
      if (node.getProp('type') == "event") {
        beginNode = node;
        const bp: IBluePrint[] = []
        var nextNE = findNextNodeAndEdge(graph, beginNode)
        while (nextNE != null) {
          bp.push(nextNE);
          nextNE = findNextNodeAndEdge(graph, nextNE.node)
        }
        const eventBuff = buffBuilder(RootStore.getEffectById(id)!.name, graph, beginNode, bp)
        if (eventBuff.buffs.length != 0) {
          RootStore.updateSkillsBuffs(id, eventBuff.buffs, eventBuff.event)
          eventBuffs.push(eventBuff)
        }
      }
    })
    RootStore.graphSave(id, graph.toJSON({ diff: true }))
    RootStore.updatePoolEbs(id, eventBuffs)
  }
  //console.log(document.getElementById(id) as HTMLElement, id)
  useEffect(() => {

    const graph = new Graph({
      container: document.getElementById(id) as HTMLElement,
      minimap: {
        enabled: true,
        container: document.getElementById(id + ".minimap") as HTMLElement,
        width: 200,
        height: 160,
        padding: 10,
        graphOptions: {
          async: true,
          getCellView(cell) {
            if (cell.isNode()) {
              return SimpleNodeView
            }
          },
          createCellView(cell) {
            if (cell.isEdge()) {
              return null
            }
          },
        },
      },
      ...graphConfig
    })
    const update = () => {
      const allEdges = graph.getEdges();
      RootStore.graphSave(id, graph.toJSON({ diff: true }))
      allEdges.map((edge) => {
        const edgeView = graph.findViewByCell(edge) as EdgeView
        edgeView.update()
      })
      UpdateBluePrint(graph)
    }
    graph.bindKey('ctrl+c', () => {
      const cells = graph.getSelectedCells().filter((cell) => { return cell.getProp('type') != 'event' })
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey('del', () => {
      const cells = graph.getSelectedCells().filter((cell) => { return cell.getProp('type') != 'event' })
      if (cells.length) {
        graph.removeCells(cells)
      }
      return false
    })
    graph.bindKey('ctrl+x', () => {
      const cells = graph.getSelectedCells().filter((cell) => { return cell.getProp('type') != 'event' })
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    graph.bindKey('c', () => {
      const parent = graph.addNode({
        x: 40,
        y: 40,
        width: 160,
        height: 160,
        zIndex: -9999,
        label: '集合',
        attrs: {
          body: {
            fill: '#fffbe6',
            stroke: '#ffe7ba',
          },
          label: {
            fontSize: 12,
          },
        },
      })
      graph.getSelectedCells().map((cell)=>{
        parent.addChild(cell)
      })
    })
    graph.on('node:embedding', ( {e} ) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })
    
    graph.on('node:embedded', () => {
      ctrlPressed = false
    })
    
    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }
    
      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })
    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler || ctrlPressed) {
        return
      }
    
      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }
    
      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }
    
        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }
    
        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false
    
        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(embedPadding)
            const corner = bbox.getCorner()
    
            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }
    
            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }
    
            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }
    
            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }
    
        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            { skipParentHandler: true },
          )
        }
      }
    })
    graph.bindKey('ctrl+v', () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })
    graph.on("cell:change:*", () => {
      RootStore.graphSave(id, graph.toJSON({ diff: true }))
    })
    graph.on("node:moved", () => update())
    graph.on("edge:removed", (e) => {
      UpdateBluePrint(graph);
    })
    graph.on("edge:connected", (e) => {
      UpdateBluePrint(graph);
    })
    

    const stencilNodes: { name: string, group: string }[] = []
    Nodes.map((node) => {
      stencilNodes.push({ name: node.name, group: node.group })
    })

    const stencil = new Addon.Stencil({
      title: '技能编辑',
      target: graph,
      search(cell, keyword) {
        return cell.getProp('type').indexOf(keyword) !== -1
      },
      placeholder: '请输入组件名称以查询',
      notFoundText: '未找到相关内容',
      validateNode: (node) => {
        var Rreturn = true;
        const nowNodeComponent = node.prop()['component']
        if (node.getProp('type') == "event") {
          graph.getNodes().map((node) => {
            if (node.prop()['component'] == nowNodeComponent) {
              Rreturn = false;
            }
          })
        }
        if (!Rreturn) {
          message.error(`事件「${nowNodeComponent}」已经在图表中被使用了`)
        }
        return Rreturn
      },
      collapsable: true,
      stencilGraphWidth: 303,
      stencilGraphHeight: 600,
      layoutOptions: {
        columns: 1,
        rowHeight: 175,
      },
      groups: [
        {
          name: 'event',
          title: '事件',
          graphHeight: 600,
        },
        {
          name: 'function',
          title: '函数',
          graphHeight: 4000,
        },
        {
          name: 'var',
          title: '变量',
          graphHeight: 500,
        },
      ],
    })
    const stencilEle = document.getElementById(id + ".stencil") as HTMLElement
    stencilEle.appendChild(stencil.container)
    const sNodes = getEnumKeysOrValue(NodeGroups, false, true)
    sNodes.map((group: string) => {
      const nodes: ReactShape<ReactShape.Properties>[] = []
      Nodes.map(item => {
        const portItems: PortManager.PortMetadata[] = []
        item.row.map((row, idx) => {
          if (row.inPorts != '') {
            switch (row.inPorts) {
              case 'number':
                break;
              default:
                var newPort: PortManager.PortMetadata = {
                  id: row.inPorts + `:${idx}`,
                  group: row.inPorts.split(":")[1],
                  // 通过 args 指定绝对位置
                  args: {
                    x: 0,
                    y: 48 + idx * 40,
                  },
                  idx: idx
                }
                portItems.push(newPort);
                break;
            }

          }
          if (row.outPorts != '') {
            switch (row.outPorts) {
              default:
                var newPort1: PortManager.PortMetadata = {
                  id: row.outPorts + `:${idx}`,
                  group: row.outPorts.split(":")[1],
                  // 通过 args 指定绝对位置
                  args: {
                    x: 120,
                    y: 48 + idx * 40,
                  },
                  idx: idx
                }
                portItems.push(newPort1);
                break;
            }
          }
        })


        if (item.group == group) {
          switch (item.group) {
            case NodeGroups.var:
              RootStore.getEffectById(id)!.args.map((arg) => {
                if (ArgsTypesStrs.indexOf(arg.type) != -1 && `${arg.type}变量` == item.name) {
                  var newPort: PortManager.PortMetadata = {
                    id: ":onlyLabel",
                    group: "onlyLabel",
                    // 通过 args 指定绝对位置
                    args: {
                      x: 0,
                      y: 48,
                    },
                    attrs: {
                      text: {
                        text: arg.name
                      }
                    }
                  }
                  portItems[0] = newPort
                  const newShape = new ReactShape({
                    width: 140,
                    height: 30 + item.row.length * 40,
                    view: UNIQ_GRAPH_ID, // 需要指定 view 属性为定义的标识
                    shape: 'react-shape',
                    portMarkup: [
                      {
                        tagName: 'rect',
                        selector: 'body',
                      },
                      {
                        tagName: 'text',
                        selector: 'label',
                      },],
                    ports: {
                      items: portItems,
                      groups: portGroupsConfig
                    },
                    component: `${arg.type}变量`, // 自定义的 React 节点
                  })
                  newShape.setProp('name', arg.name)
                  newShape.setProp('type', item.type)
                  nodes.push(newShape)
                } else {
                  switch (arg.type) {
                  }
                }

              })
              break;
            default:
              const newShape = new ReactShape({
                width: 140,
                height: 30 + item.row.length * 40,
                view: UNIQ_GRAPH_ID, // 需要指定 view 属性为定义的标识
                shape: 'react-shape',
                portMarkup: [
                  {
                    tagName: 'rect',
                    selector: 'body',
                  },
                  {
                    tagName: 'text',
                    selector: 'label',
                  },],
                ports: {
                  items: portItems,
                  groups: portGroupsConfig
                },
                component: item.name, // 自定义的 React 节点
              })
              newShape.setProp('type', item.type)
              nodes.push(newShape)
          }

        }
      })
      stencil.load(nodes, group)
    })
    const jsonSave = toJS(RootStore.getEffectById(id)!.graph) as any
    if (jsonSave) {
      jsonSave.cells.map((item: any) => {
        item["view"] = undefined
      })
      graph.fromJSON(jsonSave)
      UpdateBluePrint(graph)
    }
    setGraph(graph)
    // 在添加节点前，先将生成的 Graph 实例传入 setGrah
    /*
    // 生成一组可被添加的节点
    const nodes = data.map(dataItem => {
      return new ReactShape({
        view: UNIQ_GRAPH_ID, // 需要指定 view 属性为定义的标识
        component: <CustomReactNode />, // 自定义的 React 节点
        // .. 其它配置项
      })
    })
    // 批量添加一组节点以提升挂载性能
    graph.addCell(nodes)
    */

  }, [setGraph])

  return (
    <div>
      {/* 在原有的 React 树中挂载 Portal */}
      <Portal />
    </div>
  )
}
export default (observer(SkillEditChart));