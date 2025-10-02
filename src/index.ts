import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { INotebookTracker } from '@jupyterlab/notebook';

/**
 * 注册前端插件，监听 Comm 消息，执行任务
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'assistant:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    console.log('✨ Assistant 插件已激活');

    // 监听 Comm 通道
    app.serviceManager.sessions.runningChanged.connect(() => {
      const session = tracker?.currentWidget?.sessionContext?.session;
      if (!session?.kernel) return;

      session.kernel.commManager.registerTarget('jupyter_comm_bridge', comm => {
        console.log('🛰️ Comm 通道已建立');

        comm.onMsg = async msg => {
          const { command, request_id, ...args } = msg.content.data;
          let result = null;

          try {
            const notebook = tracker.currentWidget?.content;
            if (!notebook) throw new Error('Notebook 未加载');

            if (command === 'get_cell') {
              const cell = notebook.widgets[args.index];
              result = cell?.model.value.text ?? '';
            }

            if (command === 'set_cell') {
              const cell = notebook.widgets[args.index];
              if (cell) {
                cell.model.value.text = args.content;
                result = 'ok';
              }
            }

            if (command === 'run_cell') {
              await app.commands.execute('notebook:run-cell');
              result = 'executed';
            }

            // 回传结果
            if (request_id) {
              comm.send({ request_id, result });
            }
          } catch (err) {
            comm.send({ request_id, error: String(err) });
          }
        };
      });
    });
  }
};

export default plugin;
