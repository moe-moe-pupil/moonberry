import { Shape } from "@antv/x6"
import { Options } from "@antv/x6/lib/graph/options"
import { rectType } from "./ChartRect"
const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 3,
    attrs: {
      strokeWidth: 3,
      stroke: '#52c41a',
    },
  },
}
interface INameColor {
  name: string,
  color: string
}
export const nameColor: INameColor[] = [
  { name: 'target', color: 'rgb(0, 167, 240)' },
  { name: 'number', color: 'rgb(160, 252, 69)' },
  { name: 'string', color: 'rgb(244, 1, 204)' },
  { name: 'buff', color: 'rgb(243,58,68)'},
  { name: 'exec', color: '#fff' },
]
export const portGroupsConfig = {}
export const nameToColor = {}
portGroupsConfig['onlyLabel'] = {
  position: { name: 'absolute' },
  label: {
    position: {
      name: 'right',
    },
  },
  attrs: {
    body: {
      width: 0,
      height: 0,
      magnet: 'false',
      stroke: '#1890ff',
      opacity: 0,
      strokeWidth: 1,
      portGroup: 'onlyLabel'
    },
    text: {
      fill: '#666',
      fontSize: 16,
    },
  },
}
nameColor.map((item, idx) => {
  nameToColor[item.name + 'Out'] = item.color;
  portGroupsConfig[item.name + 'Out'] = {
    position: { name: 'absolute' },
    attrs: {
      body: {
        width: 20,
        height: 20,
        magnet: 'true',
        stroke: '#1890ff',
        fill: item.color,
        strokeWidth: 1,
        portGroup: item.name + 'Out',
      },
    },
  }
  portGroupsConfig[item.name + 'In'] = {
    position: { name: 'absolute' },
    attrs: {
      body: {
        width: 20,
        height: 20,
        magnet: 'true',
        stroke: '#1890ff',
        fill: item.color,
        strokeWidth: 1,
        portGroup: item.name + 'In',
      },
    },
  }
})

export const graphConfig: Partial<Options.Manual> = {

  background: { color: 'rgba(38, 38, 38, 1)' },
  history: {
    enabled: true,
  },
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
  },
  keyboard: {
    enabled: true,
    global: false,
  },
  clipboard: {
    enabled: true,
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowEdge: false,
    allowLoop: false,
    allowMulti: true,
    allowNode: false,
    allowPort: true,
    highlight: true,
    createEdge({ sourceMagnet }) {

      //console.log(outEdges)
      const nowPort = sourceMagnet.getAttribute('port-group');
      const portName = nowPort?.replace('Out', '')
      const outEdges = this.getOutgoingEdges(this.findView(sourceMagnet)!.cell)?.filter((edge) => { return edge.getProp('type') == portName })
      if (portName == 'exec' && outEdges && outEdges!.length > 0) {
        this.removeEdge(outEdges![0])
      }
      var rEdge = new Shape.Edge({
        router: {
          name: 'manhattan',
          args: {
            startDirections: ['right'],
            endDirections: ['left'],
          },
        },
        attrs: {
          line: {
            stroke: nameToColor[nowPort!] ? nameToColor[nowPort!] : '#fff',
            strokeWidth: 4,
            targetMarker: {
              name: 'block',
              width: 24,
              height: 16,
            },
          },
        },
        zIndex: 0,
      })

      rEdge.setProp('type', portName)

      return rEdge
    },
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group')!.indexOf('In') == -1
    },

    validateConnection({ sourceMagnet, targetMagnet, targetCell }) {
      // 只能从输出链接桩创建连接
      if (!sourceMagnet || sourceMagnet.getAttribute('port-group')?.indexOf('In') != -1) {
        return false
      }

      // 只能连接到输入链接桩
      if (!targetMagnet || targetMagnet.getAttribute('port-group') != sourceMagnet.getAttribute('port-group')?.replace('Out', 'In')) {
        return false
      }
      return true
    },
    validateEdge({ edge }) {
      const execEdges = this.getIncomingEdges(edge.getTargetCell()!)?.filter((e) => { return edge.getProp('type') == e.getProp('type') })
      if (execEdges && execEdges?.length > 1) {
        this.removeEdge(execEdges[0]);
      }
      return true
    }
  },

  scroller: {
    enabled: true,
    autoResize: true,
    pannable: {
      enabled: true,
      eventTypes: ['rightMouseDown']
    }
  },
  selecting: {
    enabled: true,
    rubberband: true, // 启用框选
    movable: true,
    showNodeSelectionBox: true,
    pointerEvents: 'none',
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
  grid: {
    size: 20,
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: 'rgba(154, 154, 154, 1)', // 主网格线颜色
        thickness: 1,     // 主网格线宽度
      },
      {
        color: 'rgba(2, 2, 2, 1)', // 次网格线颜色
        thickness: 2.5,     // 次网格线宽度
        factor: 10,        // 主次网格线间隔
      },
    ],
  },
}

export const worldMapConfig: Partial<Options.Manual> = {
  background: { color: 'rgba(128, 128, 128, 1)' },
  history: {
    enabled: true,
  },
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
  },
  keyboard: {
    enabled: true,
    global: false,
  },
  clipboard: {
    enabled: true,
  },
  embedding: {
    enabled: true,
    validate({ parent, child }) {
      if ((parent.getProp('type') != '_group' && parent.getProp('type') != '_combat') ||
       (child.getProp('type') != rectType.pc && child.getProp('type') != rectType.npc)) {
        console.log(parent.getProp('type'), child)
        return false
      }
      return true
    }
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowEdge: false,
    allowLoop: false,
    allowMulti: true,
    allowNode: false,
    allowPort: true,
    highlight: true,
    createEdge({ sourceMagnet }) {

      //console.log(outEdges)
      const nowPort = sourceMagnet.getAttribute('port-group');
      const portName = nowPort?.replace('Out', '')
      const outEdges = this.getOutgoingEdges(this.findView(sourceMagnet)!.cell)?.filter((edge) => { return edge.getProp('type') == portName })
      if (portName == 'exec' && outEdges && outEdges!.length > 0) {
        this.removeEdge(outEdges![0])
      }
      var rEdge = new Shape.Edge({
        router: {
          name: 'manhattan',
          args: {
            startDirections: ['right'],
            endDirections: ['left'],
          },
        },
        attrs: {
          line: {
            stroke: nameToColor[nowPort!] ? nameToColor[nowPort!] : '#fff',
            strokeWidth: 4,
            targetMarker: {
              name: 'block',
              width: 24,
              height: 16,
            },
          },
        },
        zIndex: 0,
      })

      rEdge.setProp('type', portName)

      return rEdge
    },
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group')!.indexOf('In') == -1
    },

    validateConnection({ sourceMagnet, targetMagnet, targetCell }) {
      // 只能从输出链接桩创建连接
      if (!sourceMagnet || sourceMagnet.getAttribute('port-group')?.indexOf('In') != -1) {
        return false
      }

      // 只能连接到输入链接桩
      if (!targetMagnet || targetMagnet.getAttribute('port-group') != sourceMagnet.getAttribute('port-group')?.replace('Out', 'In')) {
        return false
      }
      return true
    },
    validateEdge({ edge }) {
      const execEdges = this.getIncomingEdges(edge.getTargetCell()!)?.filter((e) => { return edge.getProp('type') == e.getProp('type') })
      if (execEdges && execEdges?.length > 1) {
        this.removeEdge(execEdges[0]);
      }
      return true
    }
  },

  scroller: {
    enabled: true,
    autoResize: true,
    pannable: {
      enabled: true,
      eventTypes: ['rightMouseDown']
    }
  },
  selecting: {
    enabled: true,
    rubberband: true, // 启用框选
    movable: true,
    showNodeSelectionBox: true,
    pointerEvents: 'none',
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
  grid: {
    size: 1,
    visible: true,
    type: 'mesh',
    args: [
      {
        color: 'rgba(154, 154, 154, 1)', // 主网格线颜色
        thickness: 0.1,     // 主网格线宽度
      },
    ]
  },
}
