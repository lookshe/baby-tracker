import React, { useEffect } from 'react';
import { I18n } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import PropTypes from 'prop-types';
import { FormElement, FormContent, Input, Label, DatePicker } from './Form';
import useSocket from '../hooks/useSocket';

function MeasurementForm({ onChange, values }) {
  const { date, weight, height, headCircumference } = values;
  const socket = useSocket();

  useEffect(() => {
    if (values.preventMultipleLoadLatest) {
      return;
    }
    socket.emit('measurement/latest', d => {
      if (d && d.event) {
        onChange({
          ...values,
          height: d.event.height,
          weight: d.event.weight,
          headCircumference: d.event.headCircumference,
          preventMultipleLoadLatest: true
        });
      }
    });
  }, [socket, onChange, values]);

  function handleDateChange(date) {
    onChange({ ...values, date });
  }

  function handleWeightChange(e) {
    const weight = e.target.value;
    onChange({ ...values, weight });
  }

  function handleHeightChange(e) {
    const height = e.target.value;
    onChange({ ...values, height });
  }

  function handleHeadCirumferenceChange(e) {
    const headCircumference = e.target.value;
    onChange({ ...values, headCircumference });
  }

  return (
    <FormContent>
      <FormElement>
        <Label>
          <Trans>Weight in g</Trans>
        </Label>
        <I18n>
          {({ i18n }) => (
            <Input
              type="number"
              value={weight}
              name="weight"
              placeholder={`${i18n._(t`Weight in g`)}...`}
              onChange={handleWeightChange}
            />
          )}
        </I18n>
      </FormElement>
      <FormElement>
        <Label>
          <Trans>Height in cm</Trans>
        </Label>
        <I18n>
          {({ i18n }) => (
            <Input
              type="number"
              value={height}
              name="height"
              placeholder={`${i18n._(t`Height in cm`)}...`}
              onChange={handleHeightChange}
            />
          )}
        </I18n>
      </FormElement>
      <FormElement>
        <Label>
          <Trans>Head Circumference in cm</Trans>
        </Label>
        <I18n>
          {({ i18n }) => (
            <Input
              type="number"
              value={headCircumference}
              name="headCircumference"
              placeholder={`${i18n._(t`Head Circumference in cm`)}...`}
              onChange={handleHeadCirumferenceChange}
            />
          )}
        </I18n>
      </FormElement>
      <FormElement>
        <Label>
          <Trans>Timestamp</Trans>
        </Label>
        <DatePicker
          showTimeSelect
          timeIntervals={5}
          timeFormat="HH:mm"
          timeCaption={<Trans>Time</Trans>}
          name="date"
          withPortal
          selected={date}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy HH:mm"
        />
      </FormElement>
    </FormContent>
  );
}

MeasurementForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.object
};

MeasurementForm.defaultProps = {
  values: {
    date: new Date(),
    height: 0,
    weight: 0,
    headCircumference: 0
  }
};

export default MeasurementForm;
