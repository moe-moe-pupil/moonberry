import Root from '@/stores/RootStore';
import { useStores } from '@/utils/useStores'
import { inject, observer } from 'mobx-react'
import React, { Suspense } from 'react'
import PcModal from './PcModal';
import { DragDropContext, Droppable, Draggable, DropResult, DragStart, ResponderProvided } from 'react-beautiful-dnd';
import AreaModal from './AreaModal';
import { Team } from '@/stores/GroupStore';
import styled from 'styled-components';
import SkillEditModal from './SkillEditModal';
import WorldModal from './WorldModal';
import { waitTime, waitTimeAndReturn } from '@/utils/await';

const ProLi = styled.div`
  .MuiListItem-gutters {
    width:fit-content;
    display:inline;
  }

`
const ModalList: React.FC = () => {
  const { RootStore }: Record<string, Root> = useStores();
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination || (destination.index == source.index && destination.droppableId == source.droppableId)) return;
    const dNumber = parseInt(destination.droppableId);
    const sNumber = parseInt(source.droppableId)
    if (destination.index == 0) {
      destination.index = dNumber * 10000
    }
    const Idxs = RootStore.getAllTeamsPcsIdx()
    const dIdx = Idxs[destination.index - dNumber * 10000];
    const sIdx = Idxs[source.index - sNumber * 10000];
    if (destination.droppableId != source.droppableId) {
      const dPcs = RootStore.getTeamByQQNumber(dNumber)!.pcs.slice()
      const sPcs = RootStore.getTeamByQQNumber(sNumber)!.pcs.slice()
      dPcs.splice(dIdx, 0, sPcs[sIdx])
      sPcs.splice(sIdx, 1)
      RootStore.setTeamPcs(dNumber, dPcs)
      RootStore.setTeamPcs(sNumber, sPcs)
    } else {
      /*const dPcs = RootStore.getAreaByQQNumber(dNumber)!.pcs.slice()
      const dPc = dPcs[dIdx];
      const sPc = dPcs[sIdx];
      dPcs.splice(dIdx, 1, sPc)
      dPcs.splice(sIdx, 1, dPc)
      console.log(dPcs)
      RootStore.setAreaPcs(dNumber, dPcs)
      */
    }

  };
  return (
    <ProLi>
      {RootStore.currentPcModal.map((item, idx) => {
        return (
          <PcModal Id={item.Id} visible={item.visible} bounds={item.bounds} size={item.size} key={item.Id} />
        )
      })}
      {RootStore.currentSkillEditModal.map((item, idx) => {
        return (
          <SkillEditModal Id={item.Id} visible={item.visible} bounds={item.bounds} size={item.size} key={item.Id} />
        )
      })}
      <DragDropContext onDragEnd={onDragEnd} >
        {RootStore.currentTeamModal.map((item, idx) => {
          return (
            <AreaModal Id={item.Id} name={item.name} visible={item.visible}
            bounds={item.bounds} size={item.size} key={item.Id} pcs={item.pcs} buff={item.buff} allowPcNicknameRepeat={item.allowPcNicknameRepeat} chat={item.chat} nemo={item.nemo} />
          )
        })}
      </DragDropContext>
      {RootStore.currentWorld.map((item, idx) => {
        return (
          <WorldModal Id={item.Id} visible={item.visible} bounds={item.bounds} size={item.size} key={item.Id} world={item.world} />
        )
      })}

    </ProLi>
  )
}

export default (observer(ModalList))
