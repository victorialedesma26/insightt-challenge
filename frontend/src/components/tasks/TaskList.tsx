import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArchiveIcon from '@mui/icons-material/Archive';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Task, TaskStatus } from '../../types/task';
import { STATUS_COLORS, STATUS_LABELS } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void> | void;
  onMarkDone: (taskId: string) => Promise<void> | void;
  onTransition: (taskId: string, targetStatus: TaskStatus) => Promise<void> | void;
  pendingTaskId?: string | null;
  pendingAction?: 'delete' | 'markDone' | 'transition';
}

export const TaskList = ({
  tasks,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onMarkDone,
  onTransition,
  pendingTaskId,
  pendingAction,
}: TaskListProps) => {
  const renderEmptyState = () => (
    <Stack spacing={2} alignItems="center" py={6} textAlign="center">
      <Typography variant="h6">No tasks yet</Typography>
      <Typography color="text.secondary" maxWidth={360}>
        Create your first task to keep track of priorities and progress.
      </Typography>
    </Stack>
  );

  const isActionBusy = (taskId: string, action: 'delete' | 'markDone' | 'transition') =>
    pendingTaskId === taskId && pendingAction === action;

  const statusOrder: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];
  const activeGroups = statusOrder.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
  }));
  const archivedTasks = tasks.filter((task) => task.status === 'ARCHIVED');
  const hasActiveTasks = activeGroups.some((group) => group.tasks.length > 0);

  const renderTaskRow = (task: Task) => (
    <ListItem
      key={task.id}
      divider
      sx={{
        alignItems: 'flex-start',
        gap: 1,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <ListItemText
        primaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        primary={task.title}
        secondary={task.description || 'No description provided'}
        secondaryTypographyProps={{ color: 'text.secondary' }}
      />
      <ListItemSecondaryAction sx={{ right: 0, display: 'flex', gap: 1 }}>
        {task.status === 'PENDING' && (
          <Tooltip title="Start task">
            <span>
              <IconButton
                edge="end"
                color="primary"
                disabled={isActionBusy(task.id, 'transition')}
                onClick={() => onTransition(task.id, 'IN_PROGRESS')}
                aria-label="start task"
                size="large"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                <PlayArrowIcon fontSize="inherit" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {task.status === 'IN_PROGRESS' && (
          <Tooltip title="Mark as done">
            <span>
              <IconButton
                edge="end"
                color="success"
                disabled={isActionBusy(task.id, 'markDone')}
                onClick={() => onMarkDone(task.id)}
                aria-label="mark task done"
                size="large"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  backgroundColor: 'success.main',
                  color: 'success.contrastText',
                  '&:hover': { backgroundColor: 'success.dark' },
                }}
              >
                <CheckCircleIcon fontSize="inherit" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {task.status === 'DONE' && (
          <Tooltip title="Archive task">
            <span>
              <IconButton
                edge="end"
                color="secondary"
                disabled={isActionBusy(task.id, 'transition')}
                onClick={() => onTransition(task.id, 'ARCHIVED')}
                aria-label="archive task"
                size="large"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  backgroundColor: 'secondary.main',
                  color: 'secondary.contrastText',
                  '&:hover': { backgroundColor: 'secondary.dark' },
                }}
              >
                <ArchiveIcon fontSize="inherit" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title="Edit">
          <span>
            <IconButton edge="end" onClick={() => onEdit(task)} aria-label="edit task" size="large">
              <EditIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete">
          <span>
            <IconButton
              edge="end"
              color="error"
              disabled={isActionBusy(task.id, 'delete')}
              onClick={() => onDelete(task.id)}
              aria-label="delete task"
              size="large"
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <Paper elevation={0} sx={{ p: 3, flex: 1, minHeight: 400 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={1}>
        <Typography variant="h6" fontWeight={700}>
          My Tasks
        </Typography>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={onRefresh} disabled={loading} aria-label="refresh tasks">
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {tasks.length === 0 && !loading ? (
        renderEmptyState()
      ) : (
        <Stack spacing={3}>
          {activeGroups.map((group) => (
            <Box key={group.status}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {STATUS_LABELS[group.status]}
                </Typography>
                <Chip
                  label={`${group.tasks.length} ${group.tasks.length === 1 ? 'task' : 'tasks'}`}
                  color={STATUS_COLORS[group.status]}
                  size="small"
                />
              </Stack>
              {group.tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Nothing in this stage yet.
                </Typography>
              ) : (
                <List dense>{group.tasks.map((task) => renderTaskRow(task))}</List>
              )}
            </Box>
          ))}
          {archivedTasks.length > 0 && (
            <Accordion disableGutters elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Archived
                  </Typography>
                  <Chip label={`${archivedTasks.length}`} size="small" />
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {archivedTasks.map((task) => (
                    <ListItem
                      key={task.id}
                      divider
                      sx={{
                        alignItems: 'flex-start',
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={600}>
                            {task.title}
                          </Typography>
                        }
                        secondary={task.description || 'No description provided'}
                        secondaryTypographyProps={{ color: 'text.secondary' }}
                      />
                      <ListItemSecondaryAction sx={{ right: 0, display: 'flex', gap: 1 }}>
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              edge="end"
                              color="error"
                              disabled={isActionBusy(task.id, 'delete')}
                              onClick={() => onDelete(task.id)}
                              aria-label="delete task"
                            >
                              <DeleteIcon fontSize="medium" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          )}
          {!hasActiveTasks && archivedTasks.length === 0 && renderEmptyState()}
        </Stack>
      )}
      <Box mt={3}>
        <Typography variant="caption" color="text.secondary">
          Use the controls on each card to move tasks through the workflow or archive them once completed.
        </Typography>
      </Box>
    </Paper>
  );
};
