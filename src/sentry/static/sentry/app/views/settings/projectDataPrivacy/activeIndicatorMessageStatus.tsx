import {addMessage} from 'app/actionCreators/indicator';
import {t} from 'app/locale';

export type Status = 'success' | 'loading' | 'error' | 'cancelling';

function activeIndicatorMessageStatus(status: Status) {
  if (status === 'loading') {
    addMessage(t('Loading...'), status);
  }

  if (status === 'cancelling') {
    addMessage(t('Cancelling...'), 'loading');
  }

  if (status === 'success') {
    addMessage(t('Success'), status);
  }

  if (status === 'error') {
    addMessage(t('An error occurred while saving the form'), status);
  }
}

export default activeIndicatorMessageStatus;
