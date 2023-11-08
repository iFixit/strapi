import React from 'react';

import { Flex, FocusTrap, IconButton } from '@strapi/design-system';
import { Cross, Check } from '@strapi/icons';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import getTrad from '../../../utils/getTrad';

import { FocalPointActionRow } from './components';

export const FocalPointActions = ({ onCancel, onValidate }) => {
  const { formatMessage } = useIntl();

  return (
    <FocusTrap onEscape={onCancel}>
      <FocalPointActionRow justifyContent="flex-end" paddingLeft={3} paddingRight={3}>
        <Flex gap={1}>
          <IconButton
            label={formatMessage({
              id: getTrad('control-card.cancel'),
              defaultMessage: 'Cancel',
            })}
            icon={<Cross />}
            onClick={onCancel}
          />
          <IconButton
            label={formatMessage({
              id: getTrad('control-card.save'),
              defaultMessage: 'Save',
            })}
            icon={<Check />}
            onClick={onValidate}
          />
        </Flex>
      </FocalPointActionRow>
    </FocusTrap>
  );
};

FocalPointActions.defaultProps = {};

FocalPointActions.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
};
