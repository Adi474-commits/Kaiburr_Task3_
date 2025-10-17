import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Space,
  message,
  theme,
  Card,
} from 'antd';
import {
  AppstoreOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import { Task, TaskFormData } from './types/task';
import taskService from './services/taskService';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Load all tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
      setSearchMode(false);
      message.success('Tasks loaded successfully');
    } catch (error) {
      message.error('Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskFormData) => {
    setLoading(true);
    try {
      const newTask = await taskService.createTask(taskData);
      message.success(`Task "${newTask.name}" created successfully`);
      await loadTasks();
    } catch (error) {
      message.error('Failed to create task');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    setLoading(true);
    try {
      await taskService.updateTask(task);
      message.success(`Task "${task.name}" updated successfully`);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      message.error('Failed to update task');
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    try {
      await taskService.deleteTask(id);
      message.success('Task deleted successfully');
      await loadTasks();
    } catch (error) {
      message.error('Failed to delete task');
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTask = async (id: string) => {
    setLoading(true);
    try {
      const execution = await taskService.executeTask(id);
      message.success('Task executed successfully');
      console.log('Execution result:', execution);
      await loadTasks(); // Reload to show updated execution history
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to execute task';
      message.error(errorMessage);
      console.error('Error executing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (name: string) => {
    if (!name.trim()) {
      await loadTasks();
      return;
    }

    setLoading(true);
    try {
      const results = await taskService.searchTasks(name);
      setTasks(results);
      setSearchMode(true);
      message.info(`Found ${results.length} task(s)`);
    } catch (error) {
      message.error('Search failed');
      console.error('Error searching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: colorBgContainer,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
        }}
      >
        <Space size="middle">
          <AppstoreOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
          <Title level={3} style={{ margin: 0 }}>
            Kaiburr Task Manager
          </Title>
        </Space>
      </Header>

      <Content style={{ padding: '24px 48px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header Section */}
          <Card
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
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
            </Space>
          </Card>

          {/* Create/Edit Task Form */}
          <Card
            title={editingTask ? 'Edit Task' : 'Create New Task'}
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <TaskForm
              initialValues={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={editingTask ? handleCancelEdit : undefined}
              loading={loading}
            />
          </Card>

          {/* Search Bar */}
          <Card
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <SearchBar
              onSearch={handleSearch}
              onReset={loadTasks}
              loading={loading}
              searchMode={searchMode}
            />
          </Card>

          {/* Task List */}
          <Card
            title={`Tasks (${tasks.length})`}
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <TaskList
              tasks={tasks}
              loading={loading}
              onDelete={handleDeleteTask}
              onExecute={handleExecuteTask}
              onEdit={handleEdit}
              onRefresh={loadTasks}
            />
          </Card>
        </Space>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Text type="secondary">
          Kaiburr Task Manager ©{new Date().getFullYear()} | Created by Adithya N Reddy
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          React 19 + TypeScript + Ant Design | Backend: Spring Boot + Kubernetes
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
