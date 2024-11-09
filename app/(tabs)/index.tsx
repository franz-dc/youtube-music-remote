import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { BottomNavigation } from 'react-native-paper';

import Player from './player';
import Queue from './queue';
import Settings from './settings';

const TabLayout = () => {
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'player',
      title: 'player.title',
      focusedIcon: 'play',
      unfocusedIcon: 'play-outline',
    },
    {
      key: 'queue',
      title: 'queue.title',
      focusedIcon: 'playlist-music',
      unfocusedIcon: 'playlist-music-outline',
    },
    {
      key: 'settings',
      title: 'settings.title',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    player: Player,
    queue: Queue,
    settings: Settings,
  });

  return (
    <BottomNavigation
      navigationState={{
        index,
        routes: routes.map((route) => ({ ...route, title: t(route.title) })),
      }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled
      // sceneAnimationType='shifting'
    />
  );
};

export default TabLayout;
