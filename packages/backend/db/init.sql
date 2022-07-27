DROP ROLE IF EXISTS dss_anonymous;
DROP ROLE IF EXISTS dss_authenticated;
DROP ROLE IF EXISTS dss_postgraphile;

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 
CREATE EXTENSION IF NOT EXISTS "citext"; 
CREATE SCHEMA dss_public; 
CREATE SCHEMA dss_private;

CREATE ROLE dss_postgraphile LOGIN PASSWORD 'password';
CREATE ROLE dss_anonymous;
GRANT dss_anonymous TO dss_postgraphile;
CREATE ROLE dss_authenticated;
GRANT dss_authenticated TO dss_postgraphile;

CREATE TABLE dss_public.user ( 
  id              serial primary key, 
  first_name      text not null check (char_length(first_name) < 80), 
  last_name       text check (char_length(last_name) < 80), 
  created_at      timestamp default now() 
);

CREATE TABLE dss_private.user_account ( 
  user_id         integer primary key references dss_public.user(id) on delete cascade, 
  email           citext not null unique, 
  password_hash   text not null 
);

CREATE TYPE dss_public.jwt as ( 
  role    text, 
  user_id integer 
);

CREATE FUNCTION dss_public.current_user_id() RETURNS INTEGER AS $$
  SELECT current_setting('jwt.claims.user_id', true)::integer;
$$ LANGUAGE SQL STABLE;

ALTER TABLE dss_public.user ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_user ON dss_public.user FOR SELECT
  using(true);

CREATE POLICY update_user ON dss_public.user FOR UPDATE TO dss_authenticated 
  using (id = dss_public.current_user_id());

CREATE POLICY delete_user ON dss_public.user FOR DELETE TO dss_authenticated 
  using (id = dss_public.current_user_id());

CREATE FUNCTION dss_public.register_user( 
  first_name  text, 
  last_name   text, 
  email       text, 
  password    text 
) RETURNS dss_public.user AS $$ 
DECLARE 
  new_user dss_public.user; 
BEGIN 
  INSERT INTO dss_public.user (first_name, last_name) values 
    (first_name, last_name) 
    returning * INTO new_user; 
    
  INSERT INTO dss_private.user_account (user_id, email, password_hash) values 
    (new_user.id, email, crypt(password, gen_salt('bf'))); 
    
  return new_user; 
END; 
$$ language plpgsql strict security definer;

CREATE FUNCTION dss_public.authenticate ( 
  email text, 
  password text 
) returns dss_public.jwt as $$ 
DECLARE 
  account dss_private.user_account; 
BEGIN 
  SELECT a.* INTO account 
  FROM dss_private.user_account as a 
  WHERE a.email = $1; 

  if account.password_hash = crypt(password, account.password_hash) then 
    return ('dss_authenticated', account.user_id)::dss_public.jwt; 
  else 
    return null; 
  end if; 
END; 
$$ language plpgsql strict security definer;

CREATE FUNCTION dss_public.modify_user( 
  first_name  text, 
  last_name   text, 
  email       text, 
  password    text 
) RETURNS dss_public.user AS $$ 
DECLARE 
  new_user dss_public.user; 
BEGIN 
  UPDATE dss_public.user 
    set first_name = first_name, last_name = last_name
    returning * INTO new_user; 

  UPDATE dss_private.user_account 
    set email = email, password_hash = crypt(password, gen_salt('bf'))

  return new_user; 
END; 
$$ language plpgsql strict security definer;

CREATE FUNCTION dss_public.current_user() RETURNS dss_public.user AS $$ 
  SELECT * 
  FROM dss_public.user 
  WHERE id = dss_public.current_user_id()
$$ language sql stable;


CREATE TYPE "types" AS ENUM (
  'CORE',
  'SECONDARY'
);

CREATE TYPE "positions" AS ENUM (
  'GK',
  'CB',
  'RB',
  'LB',
  'RWD',
  'LWD',
  'CMD',
  'DM',
  'CF'
);

CREATE TABLE dss_public.configuration (
  "id" SERIAL PRIMARY KEY,
  "option" varchar,
  "value" varchar
);

CREATE TABLE dss_public.ratings (
  "date" timestamp,
  "player_id" int,
  "score" float8,
  "created_at" timestamp,
  created_by integer DEFAULT dss_public.current_user_id()
);

CREATE TABLE dss_public.criteria (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "type" types,
  created_by integer DEFAULT dss_public.current_user_id()
);

CREATE TABLE dss_public.sub_criteria (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "value" int,
  parent_id int,
  created_by integer DEFAULT dss_public.current_user_id()
);

CREATE TABLE dss_public.gap (
  "id" SERIAL PRIMARY KEY,
  "gap" int,
  "integrity" real,
  "note" text,
  "sub_criteria_id" int
  created_by integer DEFAULT dss_public.current_user_id()
);

CREATE TABLE dss_public.players (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "position" positions,
  "birth" date,
  "join_date" date,
  "club_from" varchar,
  created_by integer DEFAULT dss_public.current_user_id()
);

ALTER TABLE dss_public.sub_criteria ADD FOREIGN KEY ("parent_id") REFERENCES dss_public.criteria(id) ON DELETE CASCADE ;
ALTER TABLE dss_public.ratings ADD FOREIGN KEY ("player_id") REFERENCES dss_public.players(id);
ALTER TABLE dss_public.ratings ADD FOREIGN KEY ("created_by") REFERENCES dss_public.user(id);
ALTER TABLE dss_public.criteria ADD FOREIGN KEY ("created_by") REFERENCES dss_public.user(id);
ALTER TABLE dss_public.sub_criteria ADD FOREIGN KEY ("created_by") REFERENCES dss_public.user(id);
ALTER TABLE dss_public.gap ADD FOREIGN KEY ("sub_criteria_id") REFERENCES dss_public.sub_criteria(id);


GRANT USAGE ON SCHEMA dss_public TO dss_anonymous, dss_authenticated; 
GRANT SELECT ON TABLE dss_public.user TO dss_anonymous, dss_authenticated; 
GRANT UPDATE, DELETE ON TABLE dss_public.user TO dss_authenticated; 
GRANT EXECUTE ON FUNCTION dss_public.authenticate(text, text) TO dss_anonymous, dss_authenticated; 
GRANT EXECUTE ON FUNCTION dss_public.register_user(text, text, text, text) TO dss_anonymous; 
GRANT EXECUTE ON FUNCTION dss_public.current_user() TO dss_anonymous, dss_authenticated; 

GRANT SELECT ON TABLE dss_public.players TO dss_authenticated; 
GRANT SELECT ON TABLE dss_public.ratings TO dss_authenticated; 
GRANT SELECT ON TABLE dss_public.criteria TO dss_authenticated; 
GRANT SELECT ON TABLE dss_public.sub_criteria TO dss_authenticated; 
GRANT SELECT ON TABLE dss_public.gap TO dss_authenticated; 
GRANT SELECT ON TABLE dss_public.players TO dss_authenticated; 

GRANT UPDATE, DELETE ON TABLE dss_public.gap TO dss_authenticated; 
GRANT INSERT, UPDATE, DELETE ON TABLE dss_public.players TO dss_authenticated; 
GRANT INSERT, UPDATE, DELETE  ON TABLE dss_public.ratings TO dss_authenticated; 
GRANT INSERT, UPDATE, DELETE  ON TABLE dss_public.criteria TO dss_authenticated; 
GRANT INSERT, UPDATE, DELETE  ON TABLE dss_public.sub_criteria TO dss_authenticated; 

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dss_authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA dss_public TO dss_authenticated;

ALTER TABLE dss_public.players DROP COLUMN "join_date";
ALTER TABLE dss_public.players DROP COLUMN "club_from";

ALTER TABLE dss_public.players
    ADD COLUMN phone character varying;

ALTER TABLE dss_public.players
    ADD COLUMN address text;

ALTER TABLE dss_public.players
    ADD COLUMN "backNumber" character varying;


ALTER TABLE dss_public.criteria
    ADD COLUMN "position" positions[];

ALTER TABLE dss_public.criteria
    ADD COLUMN ideal_value integer NOT NULL DEFAULT 0;


CREATE TABLE dss_public.categories (
  "id" SERIAL PRIMARY KEY,
  "title" varchar,
  "percentage" integer DEFAULT 0,
  created_by integer DEFAULT dss_public.current_user_id(),

);


GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE dss_public.categories TO dss_authenticated; 

ALTER TABLE dss_public.criteria ADD FOREIGN KEY ("parent_id") REFERENCES dss_public.categories(id) ON DELETE CASCADE ;

ALTER TABLE dss_public.criteria ADD COLUMN parent_id integer;


CREATE TABLE dss_public.score (
  "id" SERIAL PRIMARY KEY,
  player_id integer,
  value json,
  created_at  timestamp without time zone,
    created_by integer DEFAULT dss_public.current_user_id(),
  week integer
);

ALTER TABLE dss_public.ratings ADD COLUMN player_id integer;

GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE dss_public.score TO dss_authenticated; 
ALTER TABLE dss_public.score ADD FOREIGN KEY ("player_id") REFERENCES dss_public.players(id) ON DELETE CASCADE;
ALTER TABLE dss_public.score ADD FOREIGN KEY ("player_id") REFERENCES dss_public.players(id) ON DELETE CASCADE;
ALTER TABLE dss_public.ratings ADD FOREIGN KEY ("player_id") REFERENCES dss_public.players(id) ON DELETE CASCADE;

GRANT INSERT, UPDATE, DELETE ON TABLE dss_public.gap TO dss_authenticated; 
GRANT INSERT, UPDATE, DELETE ON TABLE dss_public.category TO dss_authenticated; 



CREATE TABLE dss_public.aspec (
  "id" SERIAL PRIMARY KEY,
  "percentage" int,
  created_by integer DEFAULT dss_public.current_user_id()
);


ALTER TABLE dss_public.score
    ADD COLUMN week integer;

ALTER TABLE dss_public.score
    ADD COLUMN created_at timestamp without time zone;

ALTER TABLE dss_public.score
    ADD COLUMN value json;



CREATE FUNCTION dss_public.modify_user( 
  firstname  text, 
  lastname   text, 
  username   text, 
  password   text,
  userid      int
) RETURNS dss_public.user AS $$ 
DECLARE 
  new_user dss_public.user; 
BEGIN 
  UPDATE dss_public.user 
    set first_name = firstname, last_name = lastname where id = userid
    returning * INTO new_user; 
        
  UPDATE dss_private.user_account 
    set email = username, password_hash = crypt(password, gen_salt('bf')) where user_id = new_user.id;

  return new_user; 
  
END; 
$$ language plpgsql strict security definer;


CREATE FUNCTION dss_public.user_account_by_id(id int) RETURNS dss_private.user_account AS $$ 
  DECLARE 
  new_user dss_private.user_account; 
	BEGIN 
  	SELECT * 
  	FROM dss_private.user_account 
  	WHERE user_id = id INTO new_user;
	return new_user;
  	END;
$$ language plpgsql strict security definer;

GRANT EXECUTE ON FUNCTION dss_public.user_account_by_id(int) TO  dss_authenticated; 
GRANT EXECUTE ON FUNCTION dss_public.modify_user(text, text, text, text, int) TO  dss_authenticated; 
GRANT USAGE ON SCHEMA dss_private TO dss_authenticated;
