/**
 * Art AI – React Native application entry point.
 * Bootstraps Firebase, bootsplash, and the root App component.
 */

import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
