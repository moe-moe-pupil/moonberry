import { useEffect } from 'react'
import { Graph, Addon, Edge, EdgeView, Node, NodeView } from '@antv/x6'
import { usePortal, ReactShape } from '@antv/x6-react-shape'
import { uuid } from '@/utils/uuid'
import { WorldNodeGroups, WorldNodes } from './NodesInit'
import { rectType } from './ChartRect'
import { PortManager } from '@antv/x6/lib/model/port'
import { portGroupsConfig, worldMapConfig } from './graphConfig'
import { message } from 'antd';
import Root, { } from '@/stores/RootStore'
import { useStores } from '@/utils/useStores'
import { inject, observer, Provider } from 'mobx-react'
import { toJS } from 'mobx'
import { getEnumKeysOrValue } from '@/utils/findObjectAttr'
import { SimpleNodeView } from './view'
import { IArea } from '@/stores/GroupStore'
import { waitTime } from '@/utils/await'


const UNIQ_GRAPH_ID = uuid() // 任意字符串，作为画布的唯一标识。注意：任意两张同时渲染的画布需要有不同的标识
export interface ISkillEdit {
  id: string
}
export interface IBluePrint {
  node: Node<Node.Properties>,
  edge: Edge<Edge.Properties>
}

const embedPadding = 40
var graph: Graph
export const geneGroup = (graph: Graph, combat: boolean) => {
  const nowSelected = graph.getSelectedCells()
  var averX = 0, averY = 0;
  var minX = 9999999, maxX = -9999999
  var minY = 9999999, maxY = -9999999
  nowSelected.map((cell) => {
    const nowNode = cell as Node
    const nowPos = nowNode.getPosition()
    const nowSize = nowNode.getSize()
    if (nowPos.x < minX) {
      minX = nowPos.x
    }
    if (nowPos.x + nowSize.width > maxX) {
      maxX = nowPos.x + nowSize.width
    }
    if (nowPos.y < minY) {
      minY = nowPos.y
    }
    if (nowPos.y + nowSize.height > maxY) {
      maxY = nowPos.y + nowSize.height
    }
  })

  if (nowSelected.length > 1) {
    const parent = new ReactShape({
      x: minX - embedPadding,
      y: minY - embedPadding,
      width: maxX - minX + embedPadding * 2,
      height: maxY - minY + embedPadding * 2,
      zIndex: -9999,
      view: UNIQ_GRAPH_ID, // 需要指定 view 属性为定义的标识
      shape: 'react-shape',
      component: '群组', // 自定义的 React 节点
    })
    graph.addNode(parent)
    parent.setProp('type', '_group')
    parent.setProp('combat', combat)
    graph.getSelectedCells().map((cell) => {
      if (cell.getProp('type') == rectType.pc) {
        parent.addChild(cell)
        cell.getProp('QQNumber')
      }

    })
  }
}
export const WorldChart = ({ id }: ISkillEdit) => {
  const [Portal, setGraph] = usePortal(UNIQ_GRAPH_ID)
  const { RootStore }: Record<string, Root> = useStores();
  const RootDelegate = (shape: ReactShape<ReactShape.Properties> | Node<Node.Properties>, chatAreaId?: string) => {
    shape.setProp('pc', function (QQNumber: number) { return RootStore.getPcByQQNumber(QQNumber) })
    if(chatAreaId) {
      shape.setProp('chatArea', function (chatAreaId: string) { return RootStore.getChatAreaById(chatAreaId) })
    }
    //shape.setProp('root', RootStore)
  }
  var ctrlPressed = false;

  const UpdateBluePrint = (graph: Graph) => {
    const nodes = graph.getNodes()
    const newChatAreas: IArea[] = []
    var ChatAreaIdx = 0;
    nodes.map((node) => {
      if (node.getProp('type') == rectType.pc) {
        RootDelegate(node)
        const nowView = graph.findViewByCell(node) as NodeView
        nowView.update()
      }
      if (node.getProp('type') == '_group' && node.children && node.children.length > 1) {
        const members: number[] = []
        node.children.map((child) => {
          members.push(child.getProp('QQNumber'))
        })
        const nowPos = node.getPosition()
        const nowSize = node.getSize()
        const newChatArea: IArea = {
          name: RootStore.getChatAreaByIdx(id, ChatAreaIdx)?.combat ? '战斗轮' : '虚拟讨论组',
          x: nowPos.x,
          y: nowPos.y,
          width: nowSize.width,
          height: nowSize.height,
          member: members,
          id: RootStore.getChatAreaByIdx(id, ChatAreaIdx)?.id || uuid(),
          combat: RootStore.getChatAreaByIdx(id, ChatAreaIdx)?.combat || false,
        }
        node.setProp('groupID', newChatArea.id)
        const firstCombat = node.getProp('combat')
        if (firstCombat) {
          newChatArea.combat = firstCombat
          node.setProp('combat', false)
        }
        newChatAreas.push(newChatArea)
        ChatAreaIdx += 1
        RootDelegate(node)
        const nowView = graph.findViewByCell(node) as NodeView
        nowView.update()
      }
    })
    RootStore.setChatArea(id, newChatAreas)
    RootStore.worldSave(id, graph.toJSON({ diff: true }))
    RootStore.postProcessAllSendToCheck()
  }
  //console.log(document.getElementById(id) as HTMLElement, id)
  useEffect(() => {
    graph = new Graph({
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
      ...worldMapConfig
    })
    const update = () => {
      const allEdges = graph.getEdges();
      allEdges.map((edge) => {
        const edgeView = graph.findViewByCell(edge) as EdgeView
        edgeView.update()
      })
      UpdateBluePrint(graph)
    }
    graph.bindKey('ctrl+c', () => {
      const cells = graph.getSelectedCells().filter((cell) => { return cell.getProp('type') != 'pc' })
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })
    graph.bindKey('del', () => {
      const cells = graph.getSelectedCells()
      cells.map((cell) => {
        if (cell.children) {
          cell.children.map((child) => {
            cell.unembed(child)
            //console.log('我试着移除了' + child)
          })
        }
      })
      graph.removeCells(cells)
      UpdateBluePrint(graph)
      return false
    })
    graph.bindKey('ctrl+x', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })
    /** 构造虚拟讨论组 */
    graph.bindKey('c', () => {
      const nowSelect = graph.getSelectedCells()
      if (nowSelect.length > 0) {
        const nowChatArea = RootStore.getChatAreaById(nowSelect[0].getProp('groupID'))
        if (nowSelect.length == 1 && nowSelect[0].getProp('type') == '_group' && nowChatArea) {
          RootStore.setChatAreaCombatById(nowSelect[0].getProp('groupID'), false)
        } else {
          geneGroup(graph, false)
        }
        UpdateBluePrint(graph)
      }

    })
    /**构造战斗轮 */
    graph.bindKey('d', () => {
      const nowSelect = graph.getSelectedCells()
      if (nowSelect.length > 0) {
        const nowChatArea = RootStore.getChatAreaById(nowSelect[0].getProp('groupID'))
        if (nowSelect.length == 1 && nowSelect[0].getProp('type') == '_group' && nowChatArea) {
          RootStore.setChatAreaCombatById(nowSelect[0].getProp('groupID'), true)
        } else {
          geneGroup(graph, true)
        }
        UpdateBluePrint(graph)
      }

    })
    graph.on('node:embedding', ({ e }) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })
    graph.on('node:added', () => {
      UpdateBluePrint(graph)
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
    WorldNodes.map((node) => {
      stencilNodes.push({ name: node.name, group: node.group })
    })

    const stencil = new Addon.Stencil({
      title: '物体放置',
      target: graph,
      search(cell, keyword) {
        return cell.getProp('name').indexOf(keyword) !== -1
      },
      placeholder: '请输入组件名称以查询',
      notFoundText: '未找到相关内容',
      validateNode: (node) => {
        var Rreturn = true;
        const nowNodeComponent = node.getProp('name')
        if (node.getProp('type') == "pc") {
          graph.getNodes().map((node) => {
            if (node.getProp('name') == nowNodeComponent) {
              Rreturn = false;
            }
          })
        }
        if (!Rreturn) {
          message.error(`玩家「${nowNodeComponent}」已经在图表中被使用了`)
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
          name: 'pc',
          title: '玩家目标',
          graphHeight: 1200,
        },
      ],
    })
    const stencilEle = document.getElementById(id + ".stencil") as HTMLElement
    stencilEle.appendChild(stencil.container)
    const sNodes = getEnumKeysOrValue(WorldNodeGroups, false, true)
    sNodes.map((group: string) => {
      const nodes: ReactShape<ReactShape.Properties>[] = []
      WorldNodes.map(item => {
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
            case 'pc':
              RootStore.getWorldById(id)!.world.PcNumbers.map((number) => {
                const nowPc = RootStore.getPcByQQNumber(number)!
                if (true) {
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
                        text: nowPc.name
                      }
                    }
                  }
                  portItems[0] = newPort
                  const newShape = new ReactShape({
                    width: 140,
                    height: 100 + item.row.length * 40,
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
                    component: `玩家`, // 自定义的 React 节点
                  })
                  newShape.setProp('name', nowPc.nickname)
                  newShape.setProp('QQNumber', nowPc.Id)
                  newShape.setProp('type', item.type)
                  RootDelegate(newShape)
                  nodes.push(newShape)
                }
              })
              break;
            default:
              const newShape = new ReactShape({
                width: 140,
                height: 100 + item.row.length * 40,
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
              break;
          }
        }
      })
      stencil.load(nodes, group)
    })
    setGraph(graph)


    const jsonSave = toJS(RootStore.getWorldById(id)!.world.map) as any
    if (jsonSave) {
      jsonSave.cells.map((item: any) => {
        item["view"] = undefined
      })
      console.log('jsonSave=', jsonSave)
      graph.fromJSON(jsonSave)
      UpdateBluePrint(graph)
    }

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

  useEffect(() => {
    UpdateBluePrint(graph)
  }, [RootStore.pcFresh])
  return (
    <div>
      {/* 在原有的 React 树中挂载 Portal */}
      <Portal />
    </div>
  )
}
export default (observer(WorldChart));