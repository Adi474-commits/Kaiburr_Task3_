import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tag,
  Tooltip,
  Modal,
  Typography,
  Descriptions,
  Empty,
} from 'antd';
import {
  DeleteOutlined,
  PlayCircleOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Task } from '../types/task';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
  onEdit: (task: Task) => void;
  onRefresh: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading = false,
  onDelete,
  onExecute,
  onEdit,
  onRefresh,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const showTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsModalVisible(true);
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
  };

  const renderExecutionStatus = (task: Task) => {
    const executions = task.taskExecutions || [];
    if (executions.length === 0) {
      return <Tag color="default">Not Executed</Tag>;
    }

    const lastExecution = executions[executions.length - 1];
    if (lastExecution.exitCode === 0) {
      return (
        <Tag color="success" icon={<PlayCircleOutlined />}>
          Success ({executions.length}x)
        </Tag>
      );
    } else {
      return (
        <Tag color="error">
          Failed ({executions.length}x)
        </Tag>
      );
    }
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <Text strong style={{ fontSize: '14px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      sorter: (a, b) => a.owner.localeCompare(b.owner),
    },
    {
      title: 'Command',
      dataIndex: 'command',
      key: 'command',
      render: (text: string) => (
        <Tag icon={<CodeOutlined />} color="blue">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => renderExecutionStatus(record),
      filters: [
        { text: 'Executed', value: 'executed' },
        { text: 'Not Executed', value: 'not_executed' },
      ],
      onFilter: (value, record) => {
        if (value === 'executed') {
          return (record.taskExecutions?.length || 0) > 0;
        }
        return (record.taskExecutions?.length || 0) === 0;
      },
    },
    {
      title: 'Executions',
      key: 'executionCount',
      align: 'center',
      render: (_, record) => (
        <Text type="secondary">{record.taskExecutions?.length || 0}</Text>
      ),
      sorter: (a, b) =>
        (a.taskExecutions?.length || 0) - (b.taskExecutions?.length || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => showTaskDetails(record)}
              aria-label={`View details for ${record.name}`}
            />
          </Tooltip>

          <Tooltip title="Execute Command">
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => onExecute(record.id!)}
              loading={loading}
              aria-label={`Execute task ${record.name}`}
            >
              Run
            </Button>
          </Tooltip>

          <Tooltip title="Edit Task">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              aria-label={`Edit task ${record.name}`}
            />
          </Tooltip>

          <Tooltip title="Delete Task">
            <Popconfirm
              title="Delete Task"
              description="Are you sure you want to delete this task?"
              onConfirm={() => onDelete(record.id!)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={loading}
                aria-label={`Delete task ${record.name}`}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
            aria-label="Refresh task list"
          >
            Refresh
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tasks`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No tasks found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          scroll={{ x: 1000 }}
          aria-label="Tasks table"
        />
      </Space>

      {/* Task Details Modal */}
      <Modal
        title={
          <Space>
            <CodeOutlined />
            <span>Task Details</span>
          </Space>
        }
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="execute"
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              if (selectedTask?.id) {
                onExecute(selectedTask.id);
                setDetailsModalVisible(false);
              }
            }}
          >
            Execute Now
          </Button>,
        ]}
        width={800}
      >
        {selectedTask && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Task ID">
                <Text code>{selectedTask.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Task Name">
                <Text strong>{selectedTask.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Owner">
                {selectedTask.owner}
              </Descriptions.Item>
              <Descriptions.Item label="Command">
                <Tag icon={<CodeOutlined />} color="blue">
                  {selectedTask.command}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {renderExecutionStatus(selectedTask)}
              </Descriptions.Item>
            </Descriptions>

            {selectedTask.taskExecutions &&
              selectedTask.taskExecutions.length > 0 && (
                <>
                  <Typography.Title level={5}>
                    Execution History ({selectedTask.taskExecutions.length})
                  </Typography.Title>

                  {selectedTask.taskExecutions.map((exec, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <Text strong>Execution #{index + 1}</Text>
                          {exec.exitCode === 0 ? (
                            <Tag color="success">Success</Tag>
                          ) : (
                            <Tag color="error">Failed (Code: {exec.exitCode})</Tag>
                          )}
                        </Space>

                        <div>
                          <Text type="secondary">Start Time: </Text>
                          <Text code>{formatDateTime(exec.startTime)}</Text>
                        </div>

                        <div>
                          <Text type="secondary">End Time: </Text>
                          <Text code>{formatDateTime(exec.endTime)}</Text>
                        </div>

                        <div>
                          <Text type="secondary">Duration: </Text>
                          <Text>
                            {(
                              (new Date(exec.endTime).getTime() -
                                new Date(exec.startTime).getTime()) /
                              1000
                            ).toFixed(2)}s
                          </Text>
                        </div>

                        <div>
                          <Text type="secondary">Output:</Text>
                          <Paragraph
                            code
                            copyable
                            style={{
                              marginTop: '8px',
                              padding: '8px',
                              background: '#fff',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {exec.output || '(no output)'}
                          </Paragraph>
                        </div>
                      </Space>
                    </div>
                  ))}
                </>
              )}

            {(!selectedTask.taskExecutions ||
              selectedTask.taskExecutions.length === 0) && (
              <Empty
                description="No execution history yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Space>
        )}
      </Modal>
    </>
  );
};

export default TaskList;
