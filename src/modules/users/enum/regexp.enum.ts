export class RegExp {
  USERNAME_FORMAT = /^[a-zA-Z0-9_]+$/;
  EMAIL_FORMAT = `^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$`;
  AT_LEAST_ONE_NUMBER = `^(?=.*\d).*$`;
  PASSWORD_FORMAT = '^(?=.*d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^wds:])([^s]){8,16}$';
}
