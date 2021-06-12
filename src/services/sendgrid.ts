import sendMail from '@sendgrid/mail';
import {sendgridConfig} from '../config/config.index';

sendMail.setApiKey(sendgridConfig.api_key);

export {sendMail};
