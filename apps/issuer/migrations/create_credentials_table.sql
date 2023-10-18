CREATE TABLE credentials(
  id uuid NOT NULL,
  PRIMARY KEY (id),
  did text NOT NULL,
  credential text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE nonces(
  did text NOT NULL,
  PRIMARY KEY (did),
  nonce text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT now() + interval '1 hour'
);
