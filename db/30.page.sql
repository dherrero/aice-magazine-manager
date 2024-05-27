CREATE TABLE public.page (
    id bigint NOT NULL,
    number integer NOT NULL,
    content text NOT NULL,
    title text NOT NULL,
    magazine_id bigint NOT NULL REFERENCES public.magazine (id),
    deleted boolean DEFAULT false,
    createdAt timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt timestamp without time zone,
    deletedAt timestamp without time zone,
    PRIMARY KEY(id)
);

ALTER TABLE public.page OWNER TO postgres;


CREATE SEQUENCE public.page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_id_seq OWNER TO postgres;


ALTER SEQUENCE public.page_id_seq OWNED BY public.page.id;

ALTER TABLE ONLY public.page ALTER COLUMN id SET DEFAULT nextval('public.page_id_seq'::regclass);

SELECT pg_catalog.setval('public.page_id_seq', 1, false);
