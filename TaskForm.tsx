import React from 'react';
import { Form, Input, Button, Space, Select } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Task, TaskFormData } from '../types/task';

interface TaskFormProps {
  initialValues?: Task;
  onSubmit: (task: Task | TaskFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: TaskFormData) => {
    if (initialValues?.id) {
      onSubmit({ ...initialValues, ...values });
    } else {
      onSubmit(values);
    }
    form.resetFields();
  };

  const handleReset = () => {
    form.resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  // Allowed commands for validation
  const allowedCommands = ['echo', 'date', 'uname', 'pwd', 'whoami'];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      aria-label={initialValues ? 'Edit task form' : 'Create task form'}
    >
      <Form.Item
        label="Task Name"
        name="name"
        rules={[
          { required: true, message: 'Please enter task name' },
          { min: 3, message: 'Task name must be at least 3 characters' },
          { max: 100, message: 'Task name must be less than 100 characters' },
        ]}
        tooltip="A descriptive name for your task"
      >
        <Input
          placeholder="e.g., Check System Date"
          aria-label="Task name input"
          aria-required="true"
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item
        label="Owner Name"
        name="owner"
        rules={[
          { required: true, message: 'Please enter owner name' },
          { min: 2, message: 'Owner name must be at least 2 characters' },
        ]}
        tooltip="Your name or team name"
      >
        <Input
          placeholder="e.g., Adithya N Reddy"
          aria-label="Owner name input"
          aria-required="true"
          autoComplete="name"
        />
      </Form.Item>

      <Form.Item
        label="Command"
        name="command"
        rules={[
          { required: true, message: 'Please select or enter a command' },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const baseCommand = value.trim().split(' ')[0];
              if (allowedCommands.includes(baseCommand)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(`Only these commands are allowed: ${allowedCommands.join(', ')}`)
              );
            },
          },
        ]}
        tooltip="Select a whitelisted command or enter with arguments"
      >
        <Select
          mode="tags"
          placeholder="Select or type a command (e.g., echo Hello World)"
          aria-label="Command selection"
          aria-required="true"
          maxCount={1}
          options={allowedCommands.map((cmd) => ({ label: cmd, value: cmd }))}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            aria-label={initialValues ? 'Update task' : 'Create task'}
          >
            {initialValues ? 'Update Task' : 'Create Task'}
          </Button>
          {onCancel && (
            <Button
              onClick={handleReset}
              icon={<CloseOutlined />}
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
          )}
          {!onCancel && (
            <Button
              onClick={() => form.resetFields()}
              aria-label="Reset form"
            >
              Reset
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
