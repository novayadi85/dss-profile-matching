PGDMP          ;                z         
   dss_soccer    10.14    10.14 {    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            �           1262    100661 
   dss_soccer    DATABASE     �   CREATE DATABASE dss_soccer WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
    DROP DATABASE dss_soccer;
             postgres    false            
            2615    100786    dss_private    SCHEMA        CREATE SCHEMA dss_private;
    DROP SCHEMA dss_private;
             postgres    false            �           0    0    SCHEMA dss_private    ACL     8   GRANT USAGE ON SCHEMA dss_private TO dss_authenticated;
                  postgres    false    10                        2615    100785 
   dss_public    SCHEMA        CREATE SCHEMA dss_public;
    DROP SCHEMA dss_public;
             postgres    false            �           0    0    SCHEMA dss_public    ACL     j   GRANT USAGE ON SCHEMA dss_public TO dss_anonymous;
GRANT USAGE ON SCHEMA dss_public TO dss_authenticated;
                  postgres    false    11                        2615    115089    postgraphile_watch    SCHEMA     "   CREATE SCHEMA postgraphile_watch;
     DROP SCHEMA postgraphile_watch;
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    8                        3079    12924    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            �           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1                        3079    100699    citext 	   EXTENSION     :   CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
    DROP EXTENSION citext;
                  false    8            �           0    0    EXTENSION citext    COMMENT     S   COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';
                       false    2                        3079    100662    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                  false    8            �           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                       false    3            �           1247    100821    jwt    TYPE     @   CREATE TYPE dss_public.jwt AS (
	role text,
	user_id integer
);
    DROP TYPE dss_public.jwt;
    
   dss_public       postgres    false    11            �           1247    100836 	   positions    TYPE     �   CREATE TYPE public.positions AS ENUM (
    'GK',
    'CB',
    'RB',
    'LB',
    'RWD',
    'LWD',
    'CMD',
    'DM',
    'CF',
    'LWF',
    'RWF'
);
    DROP TYPE public.positions;
       public       postgres    false    8            �           0    0    TYPE positions    COMMENT     A   COMMENT ON TYPE public.positions IS '@enum
@enumName Positions';
            public       postgres    false    706            �           1247    100830    types    TYPE     B   CREATE TYPE public.types AS ENUM (
    'CORE',
    'SECONDARY'
);
    DROP TYPE public.types;
       public       postgres    false    8            2           1255    100827    authenticate(text, text)    FUNCTION     �  CREATE FUNCTION dss_public.authenticate(email text, password text) RETURNS dss_public.jwt
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $_$ 
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
$_$;
 B   DROP FUNCTION dss_public.authenticate(email text, password text);
    
   dss_public       postgres    false    700    11    1            �           0    0 0   FUNCTION authenticate(email text, password text)    ACL     �   GRANT ALL ON FUNCTION dss_public.authenticate(email text, password text) TO dss_anonymous;
GRANT ALL ON FUNCTION dss_public.authenticate(email text, password text) TO dss_authenticated;
         
   dss_public       postgres    false    306            �            1259    100792    user    TABLE     @  CREATE TABLE dss_public."user" (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT user_first_name_check CHECK ((char_length(first_name) < 80)),
    CONSTRAINT user_last_name_check CHECK ((char_length(last_name) < 80))
);
    DROP TABLE dss_public."user";
    
   dss_public         postgres    false    11            �           0    0    TABLE "user"    ACL     �   GRANT SELECT ON TABLE dss_public."user" TO dss_anonymous;
GRANT SELECT,DELETE,UPDATE ON TABLE dss_public."user" TO dss_authenticated;
         
   dss_public       postgres    false    202            4           1255    100828    current_user()    FUNCTION     �   CREATE FUNCTION dss_public."current_user"() RETURNS dss_public."user"
    LANGUAGE sql STABLE
    AS $$ 
  SELECT * 
  FROM dss_public.user 
  WHERE id = dss_public.current_user_id()
$$;
 +   DROP FUNCTION dss_public."current_user"();
    
   dss_public       postgres    false    11    202            �           0    0    FUNCTION "current_user"()    ACL     �   GRANT ALL ON FUNCTION dss_public."current_user"() TO dss_anonymous;
GRANT ALL ON FUNCTION dss_public."current_user"() TO dss_authenticated;
         
   dss_public       postgres    false    308            1           1255    100822    current_user_id()    FUNCTION     �   CREATE FUNCTION dss_public.current_user_id() RETURNS integer
    LANGUAGE sql STABLE
    AS $$
  SELECT current_setting('jwt.claims.user_id', true)::integer;
$$;
 ,   DROP FUNCTION dss_public.current_user_id();
    
   dss_public       postgres    false    11            6           1255    115037 ,   modify_user(text, text, text, text, integer)    FUNCTION     &  CREATE FUNCTION dss_public.modify_user(firstname text, lastname text, username text, password text, userid integer) RETURNS dss_public."user"
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$ 
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
$$;
 s   DROP FUNCTION dss_public.modify_user(firstname text, lastname text, username text, password text, userid integer);
    
   dss_public       postgres    false    11    202    1            �           0    0 a   FUNCTION modify_user(firstname text, lastname text, username text, password text, userid integer)    ACL     �   GRANT ALL ON FUNCTION dss_public.modify_user(firstname text, lastname text, username text, password text, userid integer) TO dss_authenticated;
         
   dss_public       postgres    false    310            3           1255    100826 %   register_user(text, text, text, text)    FUNCTION       CREATE FUNCTION dss_public.register_user(first_name text, last_name text, email text, password text) RETURNS dss_public."user"
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$ 
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
$$;
 d   DROP FUNCTION dss_public.register_user(first_name text, last_name text, email text, password text);
    
   dss_public       postgres    false    11    202    1            �           0    0 R   FUNCTION register_user(first_name text, last_name text, email text, password text)    ACL     }   GRANT ALL ON FUNCTION dss_public.register_user(first_name text, last_name text, email text, password text) TO dss_anonymous;
         
   dss_public       postgres    false    307            �            1259    100804    user_account    TABLE     �   CREATE TABLE dss_private.user_account (
    user_id integer NOT NULL,
    email public.citext NOT NULL,
    password_hash text NOT NULL
);
 %   DROP TABLE dss_private.user_account;
       dss_private         postgres    false    2    8    2    8    2    8    2    8    2    8    10            5           1255    115073    user_account_by_id(integer)    FUNCTION     >  CREATE FUNCTION dss_public.user_account_by_id(id integer) RETURNS dss_private.user_account
    LANGUAGE plpgsql STRICT SECURITY DEFINER
    AS $$ 
  DECLARE 
  new_user dss_private.user_account; 
	BEGIN 
  	SELECT * 
  	FROM dss_private.user_account 
  	WHERE user_id = id INTO new_user;
	return new_user;
  	END;
$$;
 9   DROP FUNCTION dss_public.user_account_by_id(id integer);
    
   dss_public       postgres    false    203    11    1            �           0    0 '   FUNCTION user_account_by_id(id integer)    ACL     V   GRANT ALL ON FUNCTION dss_public.user_account_by_id(id integer) TO dss_authenticated;
         
   dss_public       postgres    false    309            7           1255    115090    notify_watchers_ddl()    FUNCTION     �  CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;
 8   DROP FUNCTION postgraphile_watch.notify_watchers_ddl();
       postgraphile_watch       postgres    false    1    12            8           1255    115091    notify_watchers_drop()    FUNCTION     _  CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;
 9   DROP FUNCTION postgraphile_watch.notify_watchers_drop();
       postgraphile_watch       postgres    false    1    12            �            1259    106494 
   categories    TABLE     �   CREATE TABLE dss_public.categories (
    id integer NOT NULL,
    title character varying,
    percentage integer DEFAULT 0,
    created_by integer DEFAULT dss_public.current_user_id()
);
 "   DROP TABLE dss_public.categories;
    
   dss_public         postgres    false    305    11                        0    0    TABLE categories    ACL     W   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE dss_public.categories TO dss_authenticated;
         
   dss_public       postgres    false    215            �            1259    106492    categories_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE dss_public.categories_id_seq;
    
   dss_public       postgres    false    215    11                       0    0    categories_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE dss_public.categories_id_seq OWNED BY dss_public.categories.id;
         
   dss_public       postgres    false    214                       0    0    SEQUENCE categories_id_seq    ACL     R   GRANT SELECT,USAGE ON SEQUENCE dss_public.categories_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    214            �            1259    100872    criteria    TABLE       CREATE TABLE dss_public.criteria (
    id integer NOT NULL,
    name text,
    type public.types,
    created_by integer DEFAULT dss_public.current_user_id(),
    ideal_value integer DEFAULT 0 NOT NULL,
    parent_id integer,
    "position" public.positions[]
);
     DROP TABLE dss_public.criteria;
    
   dss_public         postgres    false    305    703    706    11                       0    0    TABLE criteria    ACL     U   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE dss_public.criteria TO dss_authenticated;
         
   dss_public       postgres    false    207            �            1259    100870    criteria_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE dss_public.criteria_id_seq;
    
   dss_public       postgres    false    207    11                       0    0    criteria_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE dss_public.criteria_id_seq OWNED BY dss_public.criteria.id;
         
   dss_public       postgres    false    206                       0    0    SEQUENCE criteria_id_seq    ACL     P   GRANT SELECT,USAGE ON SEQUENCE dss_public.criteria_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    206            �            1259    106349    gap    TABLE     �   CREATE TABLE dss_public.gap (
    id integer NOT NULL,
    gap integer,
    integrity real,
    note text,
    sub_criteria_id integer,
    created_by integer DEFAULT dss_public.current_user_id()
);
    DROP TABLE dss_public.gap;
    
   dss_public         postgres    false    305    11                       0    0 	   TABLE gap    ACL     P   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE dss_public.gap TO dss_authenticated;
         
   dss_public       postgres    false    213            �            1259    106347 
   gap_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.gap_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE dss_public.gap_id_seq;
    
   dss_public       postgres    false    11    213                       0    0 
   gap_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE dss_public.gap_id_seq OWNED BY dss_public.gap.id;
         
   dss_public       postgres    false    212                       0    0    SEQUENCE gap_id_seq    ACL     K   GRANT SELECT,USAGE ON SEQUENCE dss_public.gap_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    212            �            1259    100903    players    TABLE     *  CREATE TABLE dss_public.players (
    id integer NOT NULL,
    name character varying,
    "position" public.positions,
    birth date,
    created_by integer DEFAULT dss_public.current_user_id(),
    phone character varying,
    address text,
    "backNumber" character varying,
    photo text
);
    DROP TABLE dss_public.players;
    
   dss_public         postgres    false    305    11    706            	           0    0    TABLE players    ACL     T   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE dss_public.players TO dss_authenticated;
         
   dss_public       postgres    false    211            �            1259    100901    players_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE dss_public.players_id_seq;
    
   dss_public       postgres    false    211    11            
           0    0    players_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE dss_public.players_id_seq OWNED BY dss_public.players.id;
         
   dss_public       postgres    false    210                       0    0    SEQUENCE players_id_seq    ACL     O   GRANT SELECT,USAGE ON SEQUENCE dss_public.players_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    210            �            1259    100866    ratings    TABLE     �   CREATE TABLE dss_public.ratings (
    created_at timestamp without time zone,
    created_by integer DEFAULT dss_public.current_user_id(),
    result json,
    week integer,
    year integer,
    "position" public.positions,
    player_id integer
);
    DROP TABLE dss_public.ratings;
    
   dss_public         postgres    false    305    706    11                       0    0    TABLE ratings    ACL     <   GRANT ALL ON TABLE dss_public.ratings TO dss_authenticated;
         
   dss_public       postgres    false    205            �            1259    106617    score    TABLE     �   CREATE TABLE dss_public.score (
    id integer NOT NULL,
    player_id integer,
    value json,
    created_at timestamp without time zone,
    created_by integer DEFAULT dss_public.current_user_id(),
    week integer
);
    DROP TABLE dss_public.score;
    
   dss_public         postgres    false    305    11                       0    0    TABLE score    ACL     R   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE dss_public.score TO dss_authenticated;
         
   dss_public       postgres    false    217            �            1259    106615    score_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.score_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE dss_public.score_id_seq;
    
   dss_public       postgres    false    11    217                       0    0    score_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE dss_public.score_id_seq OWNED BY dss_public.score.id;
         
   dss_public       postgres    false    216                       0    0    SEQUENCE score_id_seq    ACL     M   GRANT SELECT,USAGE ON SEQUENCE dss_public.score_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    216            �            1259    100884    sub_criteria    TABLE     �   CREATE TABLE dss_public.sub_criteria (
    id integer NOT NULL,
    name character varying,
    value integer,
    parent_id integer,
    created_by integer DEFAULT dss_public.current_user_id()
);
 $   DROP TABLE dss_public.sub_criteria;
    
   dss_public         postgres    false    305    11                       0    0    TABLE sub_criteria    ACL     Y   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE dss_public.sub_criteria TO dss_authenticated;
         
   dss_public       postgres    false    209            �            1259    100882    sub_criteria_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.sub_criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE dss_public.sub_criteria_id_seq;
    
   dss_public       postgres    false    11    209                       0    0    sub_criteria_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE dss_public.sub_criteria_id_seq OWNED BY dss_public.sub_criteria.id;
         
   dss_public       postgres    false    208                       0    0    SEQUENCE sub_criteria_id_seq    ACL     T   GRANT SELECT,USAGE ON SEQUENCE dss_public.sub_criteria_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    208            �            1259    100790    user_id_seq    SEQUENCE     �   CREATE SEQUENCE dss_public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE dss_public.user_id_seq;
    
   dss_public       postgres    false    11    202                       0    0    user_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE dss_public.user_id_seq OWNED BY dss_public."user".id;
         
   dss_public       postgres    false    201                       0    0    SEQUENCE user_id_seq    ACL     L   GRANT SELECT,USAGE ON SEQUENCE dss_public.user_id_seq TO dss_authenticated;
         
   dss_public       postgres    false    201            <           2604    106497    categories id    DEFAULT     v   ALTER TABLE ONLY dss_public.categories ALTER COLUMN id SET DEFAULT nextval('dss_public.categories_id_seq'::regclass);
 @   ALTER TABLE dss_public.categories ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    214    215    215            3           2604    100875    criteria id    DEFAULT     r   ALTER TABLE ONLY dss_public.criteria ALTER COLUMN id SET DEFAULT nextval('dss_public.criteria_id_seq'::regclass);
 >   ALTER TABLE dss_public.criteria ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    207    206    207            :           2604    106352    gap id    DEFAULT     h   ALTER TABLE ONLY dss_public.gap ALTER COLUMN id SET DEFAULT nextval('dss_public.gap_id_seq'::regclass);
 9   ALTER TABLE dss_public.gap ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    213    212    213            8           2604    100906 
   players id    DEFAULT     p   ALTER TABLE ONLY dss_public.players ALTER COLUMN id SET DEFAULT nextval('dss_public.players_id_seq'::regclass);
 =   ALTER TABLE dss_public.players ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    210    211    211            ?           2604    106620    score id    DEFAULT     l   ALTER TABLE ONLY dss_public.score ALTER COLUMN id SET DEFAULT nextval('dss_public.score_id_seq'::regclass);
 ;   ALTER TABLE dss_public.score ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    216    217    217            6           2604    100887    sub_criteria id    DEFAULT     z   ALTER TABLE ONLY dss_public.sub_criteria ALTER COLUMN id SET DEFAULT nextval('dss_public.sub_criteria_id_seq'::regclass);
 B   ALTER TABLE dss_public.sub_criteria ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    209    208    209            .           2604    100795    user id    DEFAULT     l   ALTER TABLE ONLY dss_public."user" ALTER COLUMN id SET DEFAULT nextval('dss_public.user_id_seq'::regclass);
 <   ALTER TABLE dss_public."user" ALTER COLUMN id DROP DEFAULT;
    
   dss_public       postgres    false    201    202    202            �          0    100804    user_account 
   TABLE DATA               J   COPY dss_private.user_account (user_id, email, password_hash) FROM stdin;
    dss_private       postgres    false    203   #�       �          0    106494 
   categories 
   TABLE DATA               K   COPY dss_public.categories (id, title, percentage, created_by) FROM stdin;
 
   dss_public       postgres    false    215   ��       �          0    100872    criteria 
   TABLE DATA               f   COPY dss_public.criteria (id, name, type, created_by, ideal_value, parent_id, "position") FROM stdin;
 
   dss_public       postgres    false    207   ˕       �          0    106349    gap 
   TABLE DATA               X   COPY dss_public.gap (id, gap, integrity, note, sub_criteria_id, created_by) FROM stdin;
 
   dss_public       postgres    false    213   ��       �          0    100903    players 
   TABLE DATA               s   COPY dss_public.players (id, name, "position", birth, created_by, phone, address, "backNumber", photo) FROM stdin;
 
   dss_public       postgres    false    211   z�       �          0    100866    ratings 
   TABLE DATA               h   COPY dss_public.ratings (created_at, created_by, result, week, year, "position", player_id) FROM stdin;
 
   dss_public       postgres    false    205   <�       �          0    106617    score 
   TABLE DATA               W   COPY dss_public.score (id, player_id, value, created_at, created_by, week) FROM stdin;
 
   dss_public       postgres    false    217   9�       �          0    100884    sub_criteria 
   TABLE DATA               R   COPY dss_public.sub_criteria (id, name, value, parent_id, created_by) FROM stdin;
 
   dss_public       postgres    false    209   �       �          0    100792    user 
   TABLE DATA               K   COPY dss_public."user" (id, first_name, last_name, created_at) FROM stdin;
 
   dss_public       postgres    false    202   ��                  0    0    categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('dss_public.categories_id_seq', 7, true);
         
   dss_public       postgres    false    214                       0    0    criteria_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('dss_public.criteria_id_seq', 16, true);
         
   dss_public       postgres    false    206                       0    0 
   gap_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dss_public.gap_id_seq', 10, true);
         
   dss_public       postgres    false    212                       0    0    players_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dss_public.players_id_seq', 13, true);
         
   dss_public       postgres    false    210                       0    0    score_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('dss_public.score_id_seq', 21, true);
         
   dss_public       postgres    false    216                       0    0    sub_criteria_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('dss_public.sub_criteria_id_seq', 17, true);
         
   dss_public       postgres    false    208                       0    0    user_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dss_public.user_id_seq', 1, true);
         
   dss_public       postgres    false    201            D           2606    100813 #   user_account user_account_email_key 
   CONSTRAINT     d   ALTER TABLE ONLY dss_private.user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);
 R   ALTER TABLE ONLY dss_private.user_account DROP CONSTRAINT user_account_email_key;
       dss_private         postgres    false    203            F           2606    100811    user_account user_account_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY dss_private.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_id);
 M   ALTER TABLE ONLY dss_private.user_account DROP CONSTRAINT user_account_pkey;
       dss_private         postgres    false    203            P           2606    106504    categories categories_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY dss_public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY dss_public.categories DROP CONSTRAINT categories_pkey;
    
   dss_public         postgres    false    215            H           2606    100881    criteria criteria_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY dss_public.criteria
    ADD CONSTRAINT criteria_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY dss_public.criteria DROP CONSTRAINT criteria_pkey;
    
   dss_public         postgres    false    207            N           2606    106358    gap gap_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY dss_public.gap
    ADD CONSTRAINT gap_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY dss_public.gap DROP CONSTRAINT gap_pkey;
    
   dss_public         postgres    false    213            L           2606    100912    players players_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY dss_public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY dss_public.players DROP CONSTRAINT players_pkey;
    
   dss_public         postgres    false    211            R           2606    106759    score score_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY dss_public.score
    ADD CONSTRAINT score_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY dss_public.score DROP CONSTRAINT score_pkey;
    
   dss_public         postgres    false    217            J           2606    100893    sub_criteria sub_criteria_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dss_public.sub_criteria
    ADD CONSTRAINT sub_criteria_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY dss_public.sub_criteria DROP CONSTRAINT sub_criteria_pkey;
    
   dss_public         postgres    false    209            B           2606    100803    user user_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY dss_public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY dss_public."user" DROP CONSTRAINT user_pkey;
    
   dss_public         postgres    false    202            S           2606    100814 &   user_account user_account_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_private.user_account
    ADD CONSTRAINT user_account_user_id_fkey FOREIGN KEY (user_id) REFERENCES dss_public."user"(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY dss_private.user_account DROP CONSTRAINT user_account_user_id_fkey;
       dss_private       postgres    false    203    2882    202            W           2606    100928 !   criteria criteria_created_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.criteria
    ADD CONSTRAINT criteria_created_by_fkey FOREIGN KEY (created_by) REFERENCES dss_public."user"(id);
 O   ALTER TABLE ONLY dss_public.criteria DROP CONSTRAINT criteria_created_by_fkey;
    
   dss_public       postgres    false    202    2882    207            X           2606    106399 "   criteria criteria_created_by_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.criteria
    ADD CONSTRAINT criteria_created_by_fkey1 FOREIGN KEY (created_by) REFERENCES dss_public."user"(id);
 P   ALTER TABLE ONLY dss_public.criteria DROP CONSTRAINT criteria_created_by_fkey1;
    
   dss_public       postgres    false    207    202    2882            Y           2606    106568     criteria criteria_parent_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.criteria
    ADD CONSTRAINT criteria_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES dss_public.categories(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY dss_public.criteria DROP CONSTRAINT criteria_parent_id_fkey;
    
   dss_public       postgres    false    207    215    2896            ]           2606    106409    gap gap_sub_criteria_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.gap
    ADD CONSTRAINT gap_sub_criteria_id_fkey FOREIGN KEY (sub_criteria_id) REFERENCES dss_public.sub_criteria(id);
 J   ALTER TABLE ONLY dss_public.gap DROP CONSTRAINT gap_sub_criteria_id_fkey;
    
   dss_public       postgres    false    2890    213    209            ^           2606    106434    gap gap_sub_criteria_id_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.gap
    ADD CONSTRAINT gap_sub_criteria_id_fkey1 FOREIGN KEY (sub_criteria_id) REFERENCES dss_public.sub_criteria(id);
 K   ALTER TABLE ONLY dss_public.gap DROP CONSTRAINT gap_sub_criteria_id_fkey1;
    
   dss_public       postgres    false    2890    213    209            T           2606    100923    ratings ratings_created_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.ratings
    ADD CONSTRAINT ratings_created_by_fkey FOREIGN KEY (created_by) REFERENCES dss_public."user"(id);
 M   ALTER TABLE ONLY dss_public.ratings DROP CONSTRAINT ratings_created_by_fkey;
    
   dss_public       postgres    false    205    202    2882            U           2606    106394     ratings ratings_created_by_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.ratings
    ADD CONSTRAINT ratings_created_by_fkey1 FOREIGN KEY (created_by) REFERENCES dss_public."user"(id);
 N   ALTER TABLE ONLY dss_public.ratings DROP CONSTRAINT ratings_created_by_fkey1;
    
   dss_public       postgres    false    202    205    2882            V           2606    106760    ratings ratings_player_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.ratings
    ADD CONSTRAINT ratings_player_id_fkey FOREIGN KEY (player_id) REFERENCES dss_public.players(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY dss_public.ratings DROP CONSTRAINT ratings_player_id_fkey;
    
   dss_public       postgres    false    211    205    2892            _           2606    106753    score score_player_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.score
    ADD CONSTRAINT score_player_id_fkey FOREIGN KEY (player_id) REFERENCES dss_public.players(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY dss_public.score DROP CONSTRAINT score_player_id_fkey;
    
   dss_public       postgres    false    217    2892    211            Z           2606    100933 )   sub_criteria sub_criteria_created_by_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.sub_criteria
    ADD CONSTRAINT sub_criteria_created_by_fkey FOREIGN KEY (created_by) REFERENCES dss_public."user"(id);
 W   ALTER TABLE ONLY dss_public.sub_criteria DROP CONSTRAINT sub_criteria_created_by_fkey;
    
   dss_public       postgres    false    202    2882    209            [           2606    106404 *   sub_criteria sub_criteria_created_by_fkey1    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.sub_criteria
    ADD CONSTRAINT sub_criteria_created_by_fkey1 FOREIGN KEY (created_by) REFERENCES dss_public."user"(id);
 X   ALTER TABLE ONLY dss_public.sub_criteria DROP CONSTRAINT sub_criteria_created_by_fkey1;
    
   dss_public       postgres    false    202    209    2882            \           2606    106573 (   sub_criteria sub_criteria_parent_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY dss_public.sub_criteria
    ADD CONSTRAINT sub_criteria_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES dss_public.criteria(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY dss_public.sub_criteria DROP CONSTRAINT sub_criteria_parent_id_fkey;
    
   dss_public       postgres    false    209    207    2888            �           3256    100825    user delete_user    POLICY     |   CREATE POLICY delete_user ON dss_public."user" FOR DELETE TO dss_authenticated USING ((id = dss_public.current_user_id()));
 .   DROP POLICY delete_user ON dss_public."user";
    
   dss_public       postgres    false    202    202    305            �           3256    100823    user select_user    POLICY     H   CREATE POLICY select_user ON dss_public."user" FOR SELECT USING (true);
 .   DROP POLICY select_user ON dss_public."user";
    
   dss_public       postgres    false    202            �           3256    100824    user update_user    POLICY     |   CREATE POLICY update_user ON dss_public."user" FOR UPDATE TO dss_authenticated USING ((id = dss_public.current_user_id()));
 .   DROP POLICY update_user ON dss_public."user";
    
   dss_public       postgres    false    202    305    202            �           0    100792    user    ROW SECURITY     8   ALTER TABLE dss_public."user" ENABLE ROW LEVEL SECURITY;         
   dss_public       postgres    false    202            ,           3466    115092    postgraphile_watch_ddl    EVENT TRIGGER       CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_ddl();
 +   DROP EVENT TRIGGER postgraphile_watch_ddl;
             postgres    false    311            -           3466    115093    postgraphile_watch_drop    EVENT TRIGGER     y   CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE PROCEDURE postgraphile_watch.notify_watchers_drop();
 ,   DROP EVENT TRIGGER postgraphile_watch_drop;
             postgres    false    312            �   [   x�3�,I-.qH�M���K���T1JT10S	+	tr�*�+,��sv7�J7�s�r�4����5��)�K0J�*����)H
����� O��      �   -   x�3�I����V�41�4�2�t�,�A<sΐ��87F���  R
�      �   �   x�u��
�@�ϳO��D�u��:h)&E�e�%�rW�s���[��`�4�o��ƁD�[%�E�,��	ZdC*s���>�v�*9�c�=�C,��^s�c]�J�ߎ"�%�KS�5	M��G�-a�Y�z cC�;E�p��Ǣ̹T��1��@TB����M�K��C���3�[��nʯ~�Ja��.k��c|��P3��<é�������Sh�      �   �   x��н�0����*ΨH�3:����R�8i�F(�wo��^��ɧ@BS�py>^4���^����Q{�8���w�r�]A��hW�o�5ڀ�:[U)�Bm�����T�Z���hs�$=Əd�ڤ�	�hs�$�T���x6o�x�7��6�4�!?x��8���0��j��u�����      �   �   x�m�A
�0EדS���Q��)�e@�%��޾���/�σ���k���e;[(5HD�PE��r �:�޶Oc$J�)���e�y3�ދ��,޲k;^������o6�f�M�y���D]��$h�v���]��'�� ��T�b(�xѯ��]�z]�CΧ=�>���7rFG      �   �  x���_KA ���Sy�����N�1J���j)�E�mQZ[��;wj��E(�́/�@~���̬d�VLX�P��eFp�{��9��8�_��jp�ev{z5�}=���p��L�a����v\NG�r�<|m<�/a���ӏ����v�ۧѦ{��c|���^]��Q�z뛽اGR�1���y�pcRo�i1=m�7��rz�;�����Ig�K�)4=d�@�3: N� �*}���:0K/�>��V�<b��q�qFB³�D����.�e!����E��_�s�I�z�;��&��bW4�J[�FN*B�I�`�E�ǂ������'m���ci��`脆EC`ړ��5�0X�:΁wO1,���;P�W����լE�O��ɏ!��"���'q�`B;
�$���ȩI�j�t�*��	-��"�I��|P;��d�`HQ3F���2nH�7j5I�0� ѱ"!e�����r	��8*�DC�j��u�@�FIU���A���	�bAH����$�j�N�w�dM�z�P�<&��j� ����M3
w�� �(��Eyv3?+������6�>�>A����CnHb���Ȩe���t��&c�H�Ѹ'p�a����;��&p��Y)�؁����t��l,I�RR�t&�yrj�B�zy}�zv�\g���Z�>ls׉���l$;�f���R����Ȫ��󝈆�_N�7�!��z�A�j]M��/}�{M]�������o#L.�      �   �   x����� E�0�ʷ!��	�$���2�M�F�z ~,�-`�ո5g緵`���i�4��%EMI�I"Z$�7W0�,����Hm�lh64:��AmP�����Hm����l��w���l�_m�&���2q+�j��b���-ap�h�T�n�=J%I�(@=h;-���8�¡�+��F� / �"��|��;
�sh7��Z{s|�Y      �   y   x�U���@D빯����!�XY�`cK�	�	9��9�2��˛Y��$�C�? .�c�N���x�t�B|�)�By�3���b�b?Z�P'�5*^��Y�A?�8�>��J_�?;�~:T      �   9   x�3�LJL/-���/K�LL��4202�50�54T0��25�26�376�46����� I�s     