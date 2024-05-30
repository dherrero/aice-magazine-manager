CREATE TABLE public.magazine (
    id bigint NOT NULL,
    number integer NOT NULL,
    path character varying(250) NOT NULL,
    image character varying(250) DEFAULT NULL,
    publhishedAt date NOT NULL,
    deleted boolean DEFAULT false,
    createdAt timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt timestamp without time zone,
    deletedAt timestamp without time zone,
    PRIMARY KEY(id),
    CONSTRAINT magazine_unique UNIQUE (number)
);

ALTER TABLE public.magazine OWNER TO postgres;


CREATE SEQUENCE public.magazine_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.magazine_id_seq OWNER TO postgres;


ALTER SEQUENCE public.magazine_id_seq OWNED BY public.magazine.id;

ALTER TABLE ONLY public.magazine ALTER COLUMN id SET DEFAULT nextval('public.magazine_id_seq'::regclass);

SELECT pg_catalog.setval('public.magazine_id_seq', 1, false);
