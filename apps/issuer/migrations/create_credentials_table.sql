CREATE TABLE credentials(
  id uuid NOT NULL,
  PRIMARY KEY (id),
  did text NOT NULL,
  credential text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);