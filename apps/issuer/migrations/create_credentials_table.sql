CREATE TABLE credentials(
  id uuid NOT NULL PRIMARY KEY,
  did text NOT NULL,
  credential text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE nonces(
  did text NOT NULL PRIMARY KEY,
  nonce text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT now() + interval '1 month'
);

CREATE TABLE user_sessions(
  id uuid NOT NULL PRIMARY KEY,
  user_pin text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_in timestamp with time zone NOT NULL DEFAULT now() + interval '1 month',
  c_nonce text,
  c_nonce_expires_in timestamp with time zone,
  credentials json[] NOT NULL,
  claims json,
  access_token text,
  credential_offer_request text
);

CREATE INDEX user_sessions_user_access_token_index ON user_sessions(access_token);
