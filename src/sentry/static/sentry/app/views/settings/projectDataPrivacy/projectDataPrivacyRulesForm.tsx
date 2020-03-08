import React from 'react';
import styled from '@emotion/styled';
import omit from 'lodash/omit';

import space from 'app/styles/space';
import {t} from 'app/locale';
import SelectControl from 'app/components/forms/selectControl';
import TextField from 'app/components/forms/textField';
import {IconDelete} from 'app/icons/iconDelete';
import Button from 'app/components/button';

import {
  getDataSelectorFieldLabel,
  getActionTypeSelectorFieldLabel,
  DATA_TYPE,
  ACTION_TYPE,
} from './utils';

type Rule = {
  id: number;
  action: ACTION_TYPE;
  data: DATA_TYPE;
  from: string;
  customRegularExpression?: string;
};

type Props = {
  onDelete?: () => void;
  onChange: (rule: Rule) => void;
} & Rule;

type State = {
  errors: {
    [key: string]: string;
  };
};
class ProjectDataPrivacyRulesForm extends React.PureComponent<Props, State> {
  state: State = {
    errors: {},
  };

  handleChange = <T extends keyof Omit<Rule, 'id'>>(stateProperty: T, value: Rule[T]) => {
    this.props.onChange({
      ...omit(this.props, 'Onchange', 'onDelete'),
      [stateProperty]: value,
    });
  };

  handleOnDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    const {onDelete} = this.props;
    onDelete && onDelete();
  };

  handleValidation = <T extends keyof Omit<Rule, 'id'>>(field: T) => () => {
    const errors = {...this.state.errors};
    const isFieldValueEmpty = !this.props[field];
    const fieldErrorAlreadyExist = errors[field];

    if (isFieldValueEmpty && fieldErrorAlreadyExist) {
      return;
    }

    if (isFieldValueEmpty && !fieldErrorAlreadyExist) {
      errors[field] = t('Field Required');
    }

    if (!isFieldValueEmpty && fieldErrorAlreadyExist) {
      delete errors[field];
    }

    this.setState({
      errors,
    });
  };

  render() {
    const {onDelete, action, from, customRegularExpression, data} = this.props;
    const {errors} = this.state;
    const displayCustomRegularExpressionField =
      data === DATA_TYPE.CUSTOM_REGULAR_EXPRESSION;
    return (
      <Wrapper hasError={Object.keys(errors).length > 0}>
        <WrapperFields displaySecondRow={displayCustomRegularExpressionField}>
          <StyledSelectControl
            placeholder={t('Select an action')}
            name="action"
            options={Object.entries(ACTION_TYPE).map(([key, value]) => ({
              label: getActionTypeSelectorFieldLabel(ACTION_TYPE[key]),
              value,
            }))}
            value={action}
            onChange={({value}) => this.handleChange('action', value)}
            openOnFocus
            required
          />

          <StyledSelectControl
            placeholder={t('Select data')}
            name="data"
            options={Object.entries(DATA_TYPE).map(([key, value]) => ({
              label: getDataSelectorFieldLabel(DATA_TYPE[key]),
              value,
            }))}
            value={data}
            onChange={({value}) => this.handleChange('data', value)}
            openOnFocus
            required
          />

          <From>{t('from')}</From>
          <StyledTextField
            name="from"
            placeholder={t('ex. strings, numbers, custom')}
            onChange={(value: string) => {
              this.handleChange('from', value);
            }}
            value={from}
            inputStyle={{
              height: '100%',
            }}
            onBlur={this.handleValidation('from')}
            error={errors.from}
          />
          {displayCustomRegularExpressionField && (
            <CustomRegularExpression
              name="customRegularExpression"
              placeholder={t('Enter custom regular expression')}
              onChange={(value: string) => {
                this.handleChange('customRegularExpression', value);
              }}
              value={customRegularExpression}
              inputStyle={{
                height: '100%',
              }}
              onBlur={this.handleValidation('customRegularExpression')}
              error={errors.customRegularExpression}
            />
          )}
        </WrapperFields>
        {onDelete && (
          <StyledIconTrash onClick={this.handleOnDelete}>
            <IconDelete />
          </StyledIconTrash>
        )}
      </Wrapper>
    );
  }
}

export default ProjectDataPrivacyRulesForm;

const Wrapper = styled('div')<{hasError?: boolean}>`
  padding: ${p => `${space(p.hasError ? 4 : 2)} ${space(3)}`};
  display: grid;
  grid-gap: ${space(2)};
  grid-template-columns: 1fr 40px;
  align-items: center;
  border-bottom: 1px solid ${p => p.theme.offWhite2};
`;

const WrapperFields = styled('div')<{displaySecondRow?: boolean}>`
  display: grid;
  grid-gap: ${space(2)};
  grid-template-columns: 157px 300px auto 1fr;
  grid-template-rows: ${p => (p.displaySecondRow ? 'auto auto' : 'auto')};
  align-items: flex-start;
`;

const From = styled('div')`
  height: 40px;
  display: flex;
  align-items: center;
`;

const StyledSelectControl = styled(SelectControl)`
  height: 40px;
  width: 100%;
`;

const StyledTextField = styled(TextField)<{error?: string}>`
  width: 100%;
  height: 40px;
  > * {
    height: 100%;
    min-height: 100%;
  }
  ${p =>
    !p.error &&
    `
      margin-bottom: 0;
    `}
`;

const CustomRegularExpression = styled(StyledTextField)`
  grid-column-start: span 4;
`;

const StyledIconTrash = styled(Button)`
  width: 40px;
  height: 100%;
`;
