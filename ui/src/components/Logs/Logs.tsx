import { Box, Chip, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { Z_UNKNOWN } from "zlib";
import { Container, ContainerState, Log } from "../../types"
import { formatName } from "../../utils/container.util";
import ReactJson from '@microlink/react-json-view'
type Props = {
  logs: Log[];
  containers: Container[];
}

const useContainersMap = (containers: Container[]): { [key: string]: Container } => {
  return containers.reduce((acc, prev) => {
    return {
      ...acc,
      [prev.Id]: prev
    }
  }, {})
}

export default function Logs({ logs, containers }: Props) {
  const containersMap = useContainersMap(containers);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
      <TableContainer sx={{ width: '100%', height: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Container</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <LogRow container={containersMap[log.containerId]} log={log} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

type LogRowProps = {
  log: Log
  container: Container
}

type LogLevels = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' | 'UNKNOWN'

type LogLevelMap = {
  [key in LogLevels]: string
}

function useDetectLogLevel(logMessage: string): LogLevels {
  const upperCaseMessage = logMessage.toUpperCase();

  // Define log level keywords
  const logLevels: Partial<LogLevelMap> = {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
    DEBUG: "DEBUG"
  }

  for (const [level, keyword] of Object.entries(logLevels)) {
    if (upperCaseMessage.includes(keyword)) {
      // Return the detected log level
      return level as LogLevels
    }
  }

  // If no log level is detected, return a default value or null
  return "UNKNOWN";
}

function LogRow({ log, container }: LogRowProps) {
  const [open, setOpen] = useState(false);
  const level = useDetectLogLevel(log.message);

  const renderContainerState = (state: ContainerState) => {
    const color = state === 'running' ? 'success' : 'secondary';
    return (
      <Chip label={state} color={color} />
    )
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Open'}
        </IconButton>
        <TableCell sx={{ fontFamily: 'monospace' }}>{log.timestamp.toISOString()}</TableCell>
        <TableCell sx={{ fontFamily: 'monospace' }}>
          {renderContainerState(container.State)}
          {' '}
          {formatName(container.Names)}
        </TableCell>
        <TableCell sx={{ fontFamily: 'monospace' }}>
          <LogLevelChip level={level} />
        </TableCell>
        <TableCell sx={{ fontFamily: 'monospace' }}>{log.message}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{log.message}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )

}


function LogLevelChip({ level }: { level: LogLevels }) {
  const levelColorMapping: Partial<{
    [key in LogLevels]: 'success' | 'info' | 'warning' | 'error' | 'default'
  }> = {
    INFO: 'success',
    WARNING: "warning",
    ERROR: "error",
    DEBUG: "info",
    UNKNOWN: 'default'
  }

  const color = levelColorMapping[level]

  return (
    <Chip label={level} color={color} />
  )
}
