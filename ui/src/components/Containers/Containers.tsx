import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material"
import { Container } from "../../types"
import { formatName } from "../../utils/container.util"

type Props = {
  containers: Container[]
}

export default function Containers({ containers }: Props) {
  return (
    <div>
      <Typography variant="subtitle1">Containers</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {containers.map(container => (
          <FormControlLabel
            label={formatName(container.Names)}
            control={<Checkbox />}
          />
        ))}
      </Box>
    </div>
  )
}


