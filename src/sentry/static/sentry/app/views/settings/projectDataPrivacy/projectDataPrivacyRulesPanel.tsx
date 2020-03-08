import React from 'react';
import styled from '@emotion/styled';

import space from 'app/styles/space';
import {t} from 'app/locale';
import {Panel, PanelHeader, PanelBody} from 'app/components/panels';
import Link from 'app/components/links/link';
import {IconAdd} from 'app/icons/iconAdd';
import Button from 'app/components/button';
import ButtonBar from 'app/components/buttonBar';
import {addMessage} from 'app/actionCreators/indicator';

import ProjectDataPrivacyRulesForm from './projectDataPrivacyRulesForm';
import {DATA_TYPE, ACTION_TYPE} from './utils';

type Rule = Omit<
  React.ComponentProps<typeof ProjectDataPrivacyRulesForm>,
  'onDelete' | 'onChange'
>;

type State = {
  rules: Array<Rule>;
  savedRules: Array<Rule>;
  status?: 'success' | 'loading' | 'error';
};

let requestResponse: Array<Rule> = [
  {
    id: 1,
    action: ACTION_TYPE.MASK,
    data: DATA_TYPE.BANK_ACCOUNTS,
    from: 'api_key && !$object',
  },
  {
    id: 2,
    action: ACTION_TYPE.REMOVE,
    data: DATA_TYPE.IP_ADDRESSES,
    from: 'xxx && xxx',
  },
];

class ProjectDataPrivacyRulesPanel extends React.Component<{}, State> {
  state: State = {
    rules: [],
    savedRules: [],
    status: 'loading',
  };

  componentDidMount() {
    this.loadRules();
  }

  loadRules = async () => {
    // add request here
    const result: Array<Rule> = await new Promise(resolve => {
      setTimeout(async function() {
        resolve(requestResponse);
      }, 1000);
    });

    this.setState({
      rules: result,
      savedRules: result,
      status: undefined,
    });
  };

  formRef: React.RefObject<HTMLFormElement> = React.createRef();

  handleAddRule = () => {
    this.setState(prevState => ({
      rules: [
        ...prevState.rules,
        {
          id: prevState.rules.length + 1,
          action: ACTION_TYPE.MASK,
          data: DATA_TYPE.BANK_ACCOUNTS,
          from: '',
        },
      ],
    }));
  };

  handleDeleteRule = (ruleId: number) => () => {
    this.setState(prevState => ({
      rules: prevState.rules.filter(rule => rule.id !== ruleId),
    }));
  };

  handleChange = (updatedRule: Rule) => {
    this.setState(prevState => ({
      ...prevState,
      rules: prevState.rules.map(rule => {
        if (rule.id === updatedRule.id) {
          return updatedRule;
        }
        return rule;
      }),
    }));
  };

  handleSubmit = () => {
    this.setState(
      prevState => ({
        status: 'success',
        savedRules: prevState.rules,
      }),
      () => {
        requestResponse = this.state.rules;
      }
    );
  };

  handleValidation = () => {
    const {rules} = this.state;
    const isAnyRuleFieldEmpty = rules.find(rule =>
      Object.keys(rule).find(ruleKey => !rule[ruleKey])
    );

    const isFormValid = !isAnyRuleFieldEmpty;

    if (isFormValid) {
      this.formRef.current?.dispatchEvent(new Event('submit'));
    } else {
      this.setState({
        status: 'error',
      });
    }
  };

  handleSaveForm = (event: React.MouseEvent) => {
    event.stopPropagation();
    this.handleValidation();
  };

  handleCancelForm = () => {
    this.setState(prevState => ({
      rules: prevState.savedRules,
    }));
  };

  render() {
    const {rules, status} = this.state;

    if (status === 'loading') {
      addMessage(t('Loading...'), status, {duration: 1000});
    }

    if (status === 'success') {
      addMessage(t('Success'), status, {duration: 2000});
    }

    if (status === 'error') {
      addMessage(t('An error occurred while saving the form'), status);
    }

    return (
      <React.Fragment>
        <Panel>
          <PanelHeader>{t('Data Privacy Rules')}</PanelHeader>
          <PanelBody>
            <form
              style={{marginBottom: 0}}
              onSubmit={this.handleSubmit}
              ref={this.formRef}
            >
              {rules.map(rule => (
                <ProjectDataPrivacyRulesForm
                  key={rule.id}
                  onDelete={this.handleDeleteRule(rule.id)}
                  onChange={this.handleChange}
                  {...rule}
                />
              ))}
            </form>
            <PanelAction>
              <StyledLink onClick={this.handleAddRule}>
                <IconAdd circle />
                <span>{t('Add Rule')}</span>
              </StyledLink>
            </PanelAction>
          </PanelBody>
        </Panel>
        {rules.length > 0 && (
          <StyledButtonBar gap={1.5}>
            <Button onClick={this.handleCancelForm}>{t('Cancel')}</Button>
            <Button priority="primary" onClick={this.handleSaveForm}>
              {t('Save Rules')}
            </Button>
          </StyledButtonBar>
        )}
      </React.Fragment>
    );
  }
}

export default ProjectDataPrivacyRulesPanel;

const PanelAction = styled('div')`
  padding: ${space(2)} ${space(3)};
`;

// TODO(style): clarify if the color below should be added to the theme or if we should use another color - #3d74db
const StyledLink = styled(Link)`
  display: inline-grid;
  grid-gap: ${space(0.5)};
  grid-template-columns: auto auto;
  align-items: center;
  color: #3d74db;
`;

const StyledButtonBar = styled(ButtonBar)`
  justify-content: flex-end;
`;
