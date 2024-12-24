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

const byWaitOptions = [
  {
    value: '',
    label: 'None',
  },
  {
    value: 'element_to_be_clickable',
    label: 'Element to be clickable',
  },
  {
    value: 'visibility_of_element_located',
    label: 'Visibility of element located',
  },
  {
    value: 'presence_of_element_located',
    label: 'Presense of element located',
  },
  {
    value: 'invisibility_of_element_located',
    label: 'Invisibility of element located',
  },
];

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
    value: 'clear',
    label: 'Clear',
    requireArg: false,
  },
  {
    value: 'click',
    label: 'Click',
    requireArg: false,
  },
  {
    value: 'get_text',
    label: 'Get Text',
    requireArg: false,
  },
  {
    value: 'get_attribute',
    label: 'Get Attribute',
    requireArg: true,
  },
  {
    value: 'is_enabled',
    label: 'Is Enabled?',
    requireArg: false,
  },
  {
    value: 'is_selected',
    label: 'Is Selected?',
    requireArg: false,
  },
  {
    value: 'submit',
    label: 'Submit',
    requireArg: false,
  },
];

const SeleniumEdit = ({ initialValues, handleSubmit }) => {
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
              <InputLabel id="byWait">By Wait</InputLabel>
              <Field
                name="byWait"
                as={Select}
                label="By Wait"
                labelId="byWait"
                value={values?.byWait}
                onChange={(e) => setFieldValue('byWait', e.target.value)}>
                {byWaitOptions.map((item) => (
                  <MenuItem value={item.value}>{item.label}</MenuItem>
                ))}
              </Field>
            </FormControl>
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
                onChange={(e) => {
                  setFieldValue('action', e.target.value);
                  setFieldValue('actionInput', '');
                }}>
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
                value={values.actionInput}
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

export default SeleniumEdit;
