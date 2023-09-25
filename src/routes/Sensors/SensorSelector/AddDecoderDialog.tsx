import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  styled,
} from '@mui/material';
import React from 'react';
import {
  DecoderConfig,
  EncodedDataType,
  SensorStruct,
} from 'src/helpers/types';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from 'src/store/hooks';
import {
  setSettings,
  settingsSelector,
} from 'src/store/settings/settingsSlice';
import { useSelector } from 'react-redux';

const StyledDivider = styled(Divider)(() => ({
  marginBottom: '2rem',
}));

interface AddDecoderDialogProps {
  open: boolean;
  onClose: () => void;
}

function AddDecoderDialog({ open, onClose }: AddDecoderDialogProps) {
  const dispatch = useAppDispatch();

  const appSettings = useSelector(settingsSelector);

  const [decoderName, setDecoderName] = React.useState<string>('');
  const [decoderConfig, setDecoderConfig] = React.useState<DecoderConfig>([]);

  function handleAddSensor() {
    setDecoderConfig((prev) => [...prev, { name: '', struct: [] }]);
  }

  function handleAddStructKey(sensorName: string) {
    setDecoderConfig((prev) =>
      prev.reduce((acc, curr) => {
        if (curr.name !== sensorName) return [...acc, curr];
        else {
          const newStruct: SensorStruct = [
            ...curr.struct,
            { key: '', dataType: 'uint16_t' },
          ];
          return [
            ...acc,
            {
              name: curr.name,
              struct: newStruct,
            },
          ];
        }
      }, [] as DecoderConfig),
    );
  }

  function handleChangeSensorName(value: string, index: number) {
    setDecoderConfig((prev) => {
      // eslint-disable-next-line fp/no-mutation
      prev[index].name = value;
      return [...prev];
    });
  }

  function handleChangeSensorStructName(value: string, i: number, j: number) {
    setDecoderConfig((prev) => {
      // eslint-disable-next-line fp/no-mutation
      prev[i].struct[j].key = value;
      return [...prev];
    });
  }

  function handleChangeSensorStructDataType(
    value: string,
    i: number,
    j: number,
  ) {
    setDecoderConfig((prev) => {
      // eslint-disable-next-line fp/no-mutation
      prev[i].struct[j].dataType = value as EncodedDataType;
      return [...prev];
    });
  }

  function saveAndClose() {
    dispatch(
      setSettings({
        userDefinedDecoders: [
          ...(appSettings.userDefinedDecoders || []),
          { name: decoderName, config: decoderConfig },
        ],
      }),
    );
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={Paper}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Create a decoder
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Create a decoder configuration. It will be able saved locally an you
          will be able to re use it the next time you visit this website.
        </DialogContentText>
        <Stack paddingTop="2rem">
          <TextField
            value={decoderName}
            onChange={(e) => setDecoderName(e.target.value)}
            label="decoder name"
            variant="outlined"
          />
          <Divider style={{ paddingTop: '2rem' }} />
          <Stack paddingTop="2rem">
            {decoderConfig.map((config, i) => (
              <Stack gap="2rem">
                <TextField
                  value={config.name}
                  label="sensor name"
                  onChange={(e) => handleChangeSensorName(e.target.value, i)}
                  variant="outlined"
                />
                {config.struct.map((struct, j) => (
                  <Stack gap="1rem">
                    <TextField
                      value={struct.key}
                      onChange={(e) =>
                        handleChangeSensorStructName(e.target.value, i, j)
                      }
                      label={`key${j}`}
                      variant="outlined"
                    />
                    <Select
                      value={struct.dataType}
                      onChange={(e) =>
                        handleChangeSensorStructDataType(e.target.value, i, j)
                      }
                      label="data type"
                    >
                      <MenuItem value="uint16_t">uint16_t</MenuItem>
                      <MenuItem value="float">float</MenuItem>
                      <MenuItem value="double">double</MenuItem>
                    </Select>
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  onClick={() => handleAddStructKey(config.name)}
                  style={{ marginTop: '1rem' }}
                >
                  Add struct key
                </Button>
                <StyledDivider />
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddSensor()}
              variant="outlined"
              style={{ marginTop: '1rem' }}
            >
              Add sensor
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={saveAndClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddDecoderDialog;
