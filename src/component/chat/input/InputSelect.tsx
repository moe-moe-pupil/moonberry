import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { inject, observer } from 'mobx-react';
import Stack from '@mui/material/Stack';
import { useStores } from '@/utils/useStores';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Checkbox, ListItemText } from '@mui/material';
import { Item } from '../ChatListItem';
import Root from '@/stores/RootStore';
import { sendTo } from '@/stores/GroupStore';
import { values } from 'mobx';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const InputSelect: React.FC<{ idx: number }> = ({ idx }) => {
  const { RootStore }: Record<string, Root> = useStores();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
    const newSendTo: sendTo = {
      targets: value
    }
    //console.log(newSendTo)
    RootStore.setCurrentSendTo(idx, newSendTo);
    RootStore.postProcessSendToCheck(idx)
  };


  return (
    <>
      <InputLabel htmlFor="grouped-select">发送对象</InputLabel>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          id="grouped-select"
          label="Grouping"
          value={RootStore.currentSendPanes[idx].sendTo.targets}
          multiple
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => RootStore.ids2ChatlistItemName(selected).join(', ')}
          MenuProps={MenuProps}
        
        >
          <MenuItem value="">
            <em>清空</em>
          </MenuItem>
          <ListSubheader>目标</ListSubheader>
          {RootStore.groups[RootStore.currentGroup].currentChatList.map((item: Item) => {
            return item.Id > 10000 ? (
              // @ts-ignore
              <MenuItem key={item.Id} value={item.Id} disabled={RootStore.checkSendToIsRepeated(item.Id, idx)}>
                {/*
                // @ts-ignore */}
                <Checkbox disabled={RootStore.checkSendToIsRepeated(item.Id, idx)} checked={RootStore.currentSendPanes[idx].sendTo.targets.map(Number).includes(item.Id)} />
                <ListItemText primary={item.nickName + ":" + item.Id} />
              </MenuItem>
            ) : (void (0))
          })}
          <ListSubheader>频道</ListSubheader>
          {RootStore.groups[RootStore.currentGroup].currentChatList.map((item: Item) => {
            return item.Id < 10000 ? (
              // @ts-ignore
              <MenuItem key={item.Id} value={item.Id} disabled={item.Id == 0 ? false : RootStore.currentSendPanes[idx].sendTo.targets.map(Number).includes(0)}>
                <Checkbox checked={RootStore.currentSendPanes[idx].sendTo.targets.map(Number).includes(item.Id)} />
                <ListItemText primary={item.nickName} />
              </MenuItem>
            ) : (void (0))
          })}
          <ListSubheader>{`虚拟讨论组`}</ListSubheader>
          {RootStore.groups[RootStore.currentGroup].currentWorlds.map((world) => (
            [(world.world.chatAreas.length != 0) && <ListSubheader>{`${world.world.name}`}</ListSubheader> &&
              world.world.chatAreas.map((chatArea) => (
                [
                  <MenuItem key={world.Id + chatArea.x} value={chatArea.id } disabled={RootStore.currentSendPanes[idx].sendTo.targets.map(Number).includes(0)} >
                    {/* 
                  // @ts-ignore */}
                    <Checkbox checked={RootStore.currentSendPanes[idx].sendTo.targets.includes(chatArea.id)} />
                    <ListItemText primary={RootStore.ids2ChatlistItemName(chatArea.member.map(String), true).join(', ')} />
                  </MenuItem>
                ]
              ))]
          )
          )
          }

        </Select>
      </FormControl>
    </>
  );
}
export default (observer(InputSelect));
