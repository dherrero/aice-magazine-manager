
CREATE TABLE public.user (
    id bigint NOT NULL,
    email character varying(150) NOT NULL UNIQUE,
    name character varying(150) NOT NULL,
    lastname character varying(150),
    permission character varying(250),
    password character varying(250) NOT NULL,
    deleted boolean DEFAULT false,
    createdAt timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt timestamp without time zone,
    deletedAt timestamp without time zone,
    PRIMARY KEY(id)
);


ALTER TABLE public.user OWNER TO postgres;


CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;


ALTER SEQUENCE public.user_id_seq OWNED BY public.user.id;

ALTER TABLE ONLY public.user ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


INSERT INTO public.user (id, email, name, lastname, password, permission) VALUES (1, 'dani@local.com', 'Daniel', 'HT', '$2b$10$MFlYds40Bv5jd3BAOvuuk.XrgzeniY84r572RGfbr5/d7O8f5bouy', 'ADMIN SEARCH_MAGAZINE');
INSERT INTO public.user (id, email, name, lastname, password, permission) VALUES (2, 'eva@local.com', 'Eva', 'HT', '$2b$10$MFlYds40Bv5jd3BAOvuuk.XrgzeniY84r572RGfbr5/d7O8f5bouy', 'SEARCH_MAGAZINE');


SELECT pg_catalog.setval('public.user_id_seq', 2);
