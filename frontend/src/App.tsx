import { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { TaskForm } from './components/tasks/TaskForm.tsx';
import { TaskList } from './components/tasks/TaskList.tsx';
import { useAuth } from './context/AuthProvider.tsx';
import { useTasks } from './hooks/useTasks.ts';
import type { Task, TaskPayload } from './types/task';

const App = () => {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const {
    tasks,
    loading,
    pendingAction,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markTaskDone,
    transitionTask,
  } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => {
    const pending = tasks.filter((task) => task.status === 'PENDING').length;
    const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
    const done = tasks.filter((task) => task.status === 'DONE').length;
    const archived = tasks.filter((task) => task.status === 'ARCHIVED').length;
    const total = tasks.length;
    const completionRate = total ? Math.round((done / total) * 100) : 0;

    return { pending, inProgress, done, archived, total, completionRate };
  }, [tasks]);

  const statCards = [
    { label: 'Total tasks', value: stats.total, helper: 'Across every stage' },
    { label: 'Pending', value: stats.pending, helper: 'Awaiting kickoff' },
    { label: 'In progress', value: stats.inProgress, helper: 'Moving right now' },
    {
      label: 'Completion',
      value: `${stats.completionRate}%`,
      helper: 'Overall workflow health',
      progress: stats.completionRate,
    },
  ];

  const isFormSubmitting = pendingAction?.type === 'create' || pendingAction?.type === 'update';

  const nextFocusCopy =
    stats.pending > 0
      ? 'Prioritize what is waiting in Pending.'
      : stats.inProgress > 0
        ? 'Keep momentum—review what is in progress.'
        : 'Everything is calm. Capture a new objective.';

  const handleCreate = async (payload: TaskPayload) => {
    await createTask(payload);
  };

  const handleUpdate = async (taskId: string, payload: TaskPayload) => {
    await updateTask(taskId, payload);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleScrollToForm = () => {
    const target = document.getElementById('task-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSyncBoard = () => {
    void fetchTasks();
  };

  if (isLoading) {
    return (
      <Stack minHeight="100vh" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  const initials =
    user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 10% 20%, rgba(15,76,129,0.08), transparent 50%), radial-gradient(circle at 90% 0%, rgba(255,122,24,0.1), transparent 55%), linear-gradient(135deg, #F6F8FB 0%, #EEF3FF 100%)',
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(15,76,129,0.08)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'secondary.main',
              }}
            />
            <Typography variant="h6" fontWeight={700} color="primary.main">
              TaskFlow Studio
            </Typography>
          </Stack>
          {isAuthenticated ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="Secure workspace" color="secondary" variant="outlined" />
              <Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>
              <Button variant="outlined" onClick={logout}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Button variant="contained" color="secondary" onClick={login}>
              Sign in
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        {!isAuthenticated ? (
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'left',
              background: 'linear-gradient(130deg, #0F4C81 0%, #172554 70%)',
              color: 'common.white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 45%)',
                opacity: 0.8,
              }}
            />
            <Stack spacing={3} position="relative">
              <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
                Technical test · Auth0 secured
              </Typography>
              <Typography variant="h3" fontWeight={700}>
                Organize work like a product team
              </Typography>
              <Typography maxWidth={540} color="rgba(255,255,255,0.8)">
                Capture ideas, move them through Pending → In Progress → Done, and archive what is
                complete. Authentication keeps every task scoped to your account.
              </Typography>
              <Stack spacing={1.5}>
                {['Real-time JWT auth', 'Strict status transitions', 'Activity logging'].map(
                  (item) => (
                    <Stack direction="row" spacing={1.5} alignItems="center" key={item}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'common.white',
                          opacity: 0.7,
                        }}
                      />
                      <Typography color="rgba(255,255,255,0.85)" variant="body1">
                        {item}
                      </Typography>
                    </Stack>
                  ),
                )}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" color="secondary" size="large" onClick={login}>
                  Sign in with Auth0
                </Button>
                <Button variant="text" color="inherit" onClick={login}>
                  View a live workspace
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ) : (
          <Stack spacing={4}>
            <Paper
              sx={{
                p: { xs: 4, md: 5 },
                background: 'linear-gradient(120deg, #0F4C81 0%, #172554 70%)',
                color: 'common.white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2), transparent 60%)',
                  opacity: 0.6,
                }}
              />
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                alignItems="center"
                position="relative"
              >
                <Box flex={1}>
                  <Chip
                    label="Today’s workspace"
                    variant="outlined"
                    sx={{ borderColor: 'rgba(255,255,255,0.6)', color: 'common.white', mb: 2 }}
                  />
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {`Hello ${user?.given_name ?? user?.nickname ?? 'maker'}, own your flow.`}
                  </Typography>
                  <Typography color="rgba(255,255,255,0.85)" mb={3}>
                    {nextFocusCopy}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button variant="contained" color="secondary" onClick={handleScrollToForm}>
                      Add a task
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={handleSyncBoard}>
                      Sync board
                    </Button>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    minWidth: 220,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 3,
                    p: 3,
                  }}
                >
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    Completion
                  </Typography>
                  <Typography variant="h3" fontWeight={700}>
                    {stats.completionRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.completionRate}
                    sx={{
                      mt: 2,
                      height: 8,
                      bgcolor: 'rgba(255,255,255,0.3)',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#FFB347' },
                    }}
                  />
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    {stats.done} done · {stats.archived} archived
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'minmax(0, 2.4fr) minmax(320px, 1fr)',
                },
                gap: { xs: 3, lg: 4 },
                alignItems: 'start',
              }}
            >
              <TaskList
                tasks={tasks}
                loading={loading}
                onRefresh={fetchTasks}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onMarkDone={markTaskDone}
                onTransition={transitionTask}
                pendingTaskId={pendingAction?.taskId}
                pendingAction={
                  pendingAction?.type === 'delete' ||
                  pendingAction?.type === 'markDone' ||
                  pendingAction?.type === 'transition'
                    ? pendingAction.type
                    : undefined
                }
              />
              <Stack spacing={3}>
                <Box id="task-form">
                  <TaskForm
                    task={editingTask}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onCancelEdit={handleCancelEdit}
                    isSubmitting={Boolean(isFormSubmitting)}
                  />
                </Box>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Workflow status
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                      },
                      gap: 2,
                    }}
                  >
                    {statCards.map((card) => (
                      <Stack key={card.label} spacing={card.progress ? 1.5 : 0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {card.label}
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {card.value}
                        </Typography>
                        {typeof card.progress === 'number' ? (
                          <LinearProgress
                            variant="determinate"
                            value={card.progress}
                            sx={{ height: 6, borderRadius: 999 }}
                          />
                        ) : null}
                        <Typography variant="body2" color="text.secondary">
                          {card.helper}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default App;
