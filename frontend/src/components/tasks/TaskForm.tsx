import { Alert, Paper, Stack, TextField, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Task, TaskPayload } from '../../types/task';

interface TaskFormProps {
  task?: Task | null;
  onCreate: (payload: TaskPayload) => Promise<void>;
  onUpdate: (taskId: string, payload: TaskPayload) => Promise<void>;
  onCancelEdit: () => void;
  isSubmitting: boolean;
}

const defaultValues: TaskPayload = {
  title: '',
  description: '',
};

export const TaskForm = ({ task, onCreate, onUpdate, onCancelEdit, isSubmitting }: TaskFormProps) => {
  const [values, setValues] = useState<TaskPayload>(defaultValues);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const isEditing = Boolean(task);
  const isDescriptionLocked = task?.status === 'DONE';

  useEffect(() => {
    if (task) {
      setValues({ title: task.title, description: task.description ?? '' });
    } else {
      setValues(defaultValues);
    }
  }, [task]);

  const validate = () => {
    const nextErrors: { title?: string } = {};
    if (!values.title.trim()) {
      nextErrors.title = 'Title is required';
    }
    if (values.title.trim().length < 3) {
      nextErrors.title = 'Use at least 3 characters';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const trimmedTitle = values.title.trim();
    const trimmedDescription = values.description?.trim();

    const payload: TaskPayload = {
      title: trimmedTitle,
    };

    if (!isDescriptionLocked && trimmedDescription !== undefined) {
      payload.description = trimmedDescription;
    }

    if (task) {
      await onUpdate(task.id, payload);
    } else {
      await onCreate(payload);
      setValues(defaultValues);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography variant="h6">{isEditing ? 'Edit Task' : 'Create a Task'}</Typography>
        {isDescriptionLocked && (
          <Alert severity="info" variant="outlined">
            Tasks marked as done allow title tweaks only; notes stay read-only.
          </Alert>
        )}
        <TextField
          label="Title"
          name="title"
          value={values.title}
          onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
          error={Boolean(errors.title)}
          helperText={errors.title}
          fullWidth
          required
        />
        <TextField
          label="Description"
          name="description"
          value={values.description}
          onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
          fullWidth
          multiline
          minRows={3}
          disabled={isDescriptionLocked}
          helperText={isDescriptionLocked ? 'Completed tasks lock the note body.' : undefined}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {isEditing && (
            <Button variant="text" onClick={onCancelEdit} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {isEditing ? 'Save changes' : 'Add task'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
