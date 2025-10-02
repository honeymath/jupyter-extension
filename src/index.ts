import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the assistant extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'assistant:plugin',
  description: 'A JupyterLab extension for AI-assist editing',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension assistant is activated!');
  }
};

export default plugin;
