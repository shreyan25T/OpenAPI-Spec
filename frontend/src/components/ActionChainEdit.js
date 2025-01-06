import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  TextField,
  Button,
} from '@mui/material';

const byLocationOptions = [
  {
    value: 'NAME',
    label: 'Name',
  },
  {
    value: 'ID',
    label: 'Id',
  },
  {
    value: 'XPATH',
    label: 'XPath',
  },
  {
    value: 'CSS_SELECTOR',
    label: 'CSS Selector',
  },
  {
    value: 'CLASS_NAME',
    label: 'Class name',
  },
  {
    value: 'LINK_TEXT',
    label: 'link text',
  },
  {
    value: 'PARTIAL_LINK_TEXT',
    label: 'partial link text',
  },
];

const actionOptions = [
  {
    value: 'send_keys',
    label: 'Send Keys',
    requireArg: true,
  },
  {
    value: 'click',
    label: 'Click',
    requireArg: false,
  },
  {
    value: 'click_and_hold',
    label: 'Click and Hold',
    requireArg: false,
  },
  {
    value: 'context_click',
    label: 'Context Click',
    requireArg: false,
  },
  {
    value: 'double_click',
    label: 'Double Click',
    requireArg: false,
  },
  // {
  //   value: 'drag_and_drop',
  //   label: 'Drag and Drop',
  //   requireArg: false,
  // },
  // {
  //   value: 'drag_and_drop_by_offset',
  //   label: 'Drag and Drop by Offset',
  //   requireArg: true,
  // },
  {
    value: 'key_down',
    label: 'Key Down',
    requireArg: false,
  },
  {
    value: 'key_up',
    label: 'Key Up',
    requireArg: false,
  },
  {
    value: 'move_by_offset',
    label: 'Move by Offset',
    requireArg: true,
  },
  {
    value: 'move_to_element',
    label: 'Move to Element',
    requireArg: false,
  },
  {
    value: 'move_to_element_with_offset',
    label: 'Move to element with offset',
    requireArg: true,
  },
  {
    value: 'pause',
    label: 'Pause all inputs',
    requireArg: true,
  },
  {
    value: 'release',
    label: 'Release held mouse',
    requireArg: true,
  },
];

const PytestEdit = ({ initialValues, handleSubmit }) => {
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              paddingX: 2,
            }}>
            <FormControl fullWidth>
              <InputLabel id="by">By Location</InputLabel>
              <Field
                name="by"
                as={Select}
                label="By Location"
                labelId="by"
                value={values?.by}
                onChange={(e) => setFieldValue('by', e.target.value)}>
                {byLocationOptions.map((item) => (
                  <MenuItem value={item.value}>{item.label}</MenuItem>
                ))}
              </Field>
            </FormControl>
            <Field
              name="byInput"
              as={TextField}
              label="By Location Input"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="action">Command</InputLabel>
              <Field
                name="action"
                as={Select}
                label="Command"
                labelId="action"
                value={values?.action}
                onChange={(e) => setFieldValue('action', e.target.value)}>
                {actionOptions.map((item) => (
                  <MenuItem value={item.value}>{item.label}</MenuItem>
                ))}
              </Field>
            </FormControl>
            {actionOptions.filter((item) => item.value === values?.action)[0]
              ?.requireArg && (
              <Field
                name="actionInput"
                as={TextField}
                label="Command Input"
                fullWidth
              />
            )}
          </Box>
          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              position: 'absolute',
              bottom: '0',
              width: '100%',
              justifyContent: 'space-between',
              p: 2,
              borderTop: '1px solid #e0e0e0',
            }}>
            <Button type="reset" variant="contained" color="secondary">
              Reset
            </Button>
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PytestEdit;
