import { useState } from 'react';
import {
  Layout,
  Typography,
  Space,
  message,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Tag,
} from 'antd';
import {
  AppstoreOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

// Mock data
const mockTasks = [
  {
    id: '1',
    name: 'system-info',
    taskname: 'Get System Information',
    command: 'uname -a',
    status: 'completed',
    executionHistory: [
      {
        timestamp: '2024-10-17T13:45:00Z',
        output: 'Linux task-pod 5.15.0-119-generic #129-Ubuntu SMP Fri Aug 2 19:25:20 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux',
        exitCode: 0
      }
    ]
  },
  {
    id: '2',
    name: 'current-date',
    taskname: 'Show Current Date',
    command: 'date',
    status: 'pending',
    executionHistory: []
  }
];

function App() {
  const [tasks, setTasks] = useState(mockTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  const showModal = (task = null) => {
    setEditingTask(task);
    setIsModalVisible(true);
    if (task) {
      form.setFieldsValue(task);
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingTask) {
        // Update existing task
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...values } : t));
        message.success('Task updated successfully');
      } else {
        // Create new task
        const newTask = {
          id: Date.now().toString(),
          ...values,
          status: 'pending',
          executionHistory: []
        };
        setTasks([...tasks, newTask]);
        message.success('Task created successfully');
      }
      setIsModalVisible(false);
      setEditingTask(null);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      onOk: () => {
        setTasks(tasks.filter(t => t.id !== id));
        message.success('Task deleted successfully');
      }
    });
  };

  const handleExecute = (id) => {
    const task = tasks.find(t => t.id === id);
    const mockExecution = {
      timestamp: new Date().toISOString(),
      output: `Mock execution of command: ${task.command}\nExecution completed successfully!`,
      exitCode: 0
    };
    
    setTasks(tasks.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status: 'completed',
            executionHistory: [...(t.executionHistory || []), mockExecution]
          } 
        : t
    ));
    message.success('Task executed successfully');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Task Name',
      dataIndex: 'taskname',
      key: 'taskname',
    },
    {
      title: 'Command',
      dataIndex: 'command',
      key: 'command',
      render: (text) => <code>{text}</code>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Executions',
      key: 'executions',
      render: (_, record) => record.executionHistory?.length || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />}
            onClick={() => handleExecute(record.id)}
            size="small"
          >
            Execute
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
        }}
      >
        <Space size="middle">
          <AppstoreOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0 }}>
            Kaiburr Task Manager
          </Title>
          <Tag color="orange">DEMO MODE</Tag>
        </Space>
      </Header>

      <Content style={{ padding: '24px 48px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header Section */}
          <Card>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center">
                <CodeOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <Title level={4} style={{ margin: 0 }}>
                  Kubernetes Pod-Based Command Execution
                </Title>
              </Space>
              <Text type="secondary">
                Create, manage, and execute shell commands in isolated Kubernetes pods. 
                All commands run in ephemeral busybox containers with full execution tracking.
              </Text>
              <Text type="warning">
                📢 Demo Mode: Backend API not available. Showing mock data and functionality.
              </Text>
            </Space>
          </Card>

          {/* Action Buttons */}
          <Card>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Create New Task
              </Button>
              <Button onClick={() => message.info('Refreshed (Demo Mode)')}>
                Refresh Tasks
              </Button>
            </Space>
          </Card>

          {/* Task List */}
          <Card title={`Tasks (${tasks.length})`}>
            <Table 
              dataSource={tasks}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Space>
      </Content>

      {/* Create/Edit Modal */}
      <Modal
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter task name' }]}
          >
            <Input placeholder="e.g. system-info" />
          </Form.Item>
          <Form.Item
            name="taskname"
            label="Task Name"
            rules={[{ required: true, message: 'Please enter task description' }]}
          >
            <Input placeholder="e.g. Get System Information" />
          </Form.Item>
          <Form.Item
            name="command"
            label="Command"
            rules={[{ required: true, message: 'Please enter command' }]}
          >
            <Select placeholder="Select a command">
              <Option value="echo 'Hello World'">echo 'Hello World'</Option>
              <Option value="date">date</Option>
              <Option value="uname -a">uname -a</Option>
              <Option value="pwd">pwd</Option>
              <Option value="whoami">whoami</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Footer style={{ textAlign: 'center' }}>
        <Text type="secondary">
          Kaiburr Task Manager ©{new Date().getFullYear()} | Created by Adithya N Reddy
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          React 18 + TypeScript + Ant Design | Backend: Spring Boot + Kubernetes
        </Text>
      </Footer>
    </Layout>
  );
}

export default App;