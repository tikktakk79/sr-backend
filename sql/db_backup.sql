--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.0

-- Started on 2021-04-15 10:14:59 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'ISO_8859_5';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 209 (class 1255 OID 16556)
-- Name: ny_van(character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.ny_van(anv1 character varying, anv2 character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO vanner(anvandare1, anvandare2, godkann)
	VALUES(LEAST(anv1, anv2), GREATEST(anv1, anv2), anv2)
	;
END;
$$;


ALTER PROCEDURE public.ny_van(anv1 character varying, anv2 character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 16477)
-- Name: anvandare; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anvandare (
    anvandarnamn character varying(20) NOT NULL,
    fornamn character varying(20) NOT NULL,
    efternamn character varying(20) NOT NULL,
    email character varying(35),
    losenord character varying(128) NOT NULL,
    hemligt boolean DEFAULT false
);


ALTER TABLE public.anvandare OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 24674)
-- Name: programbetyg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programbetyg (
    id integer NOT NULL,
    anvandare character varying(20) NOT NULL,
    programnamn text,
    programid text,
    betyg smallint
);


ALTER TABLE public.programbetyg OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 24672)
-- Name: programbetyg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.programbetyg_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.programbetyg_id_seq OWNER TO postgres;

--
-- TOC entry 3310 (class 0 OID 0)
-- Dependencies: 207
-- Name: programbetyg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programbetyg_id_seq OWNED BY public.programbetyg.id;


--
-- TOC entry 202 (class 1259 OID 16536)
-- Name: rekommendationer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rekommendationer (
    id integer NOT NULL,
    tipsare character varying(20) NOT NULL,
    mottagare character varying(20) NOT NULL,
    beskrivning text,
    avsnitt integer
);


ALTER TABLE public.rekommendationer OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 16534)
-- Name: rekommendationer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rekommendationer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rekommendationer_id_seq OWNER TO postgres;

--
-- TOC entry 3311 (class 0 OID 0)
-- Dependencies: 201
-- Name: rekommendationer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rekommendationer_id_seq OWNED BY public.rekommendationer.id;


--
-- TOC entry 206 (class 1259 OID 16634)
-- Name: sparade_avsnitt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sparade_avsnitt (
    id integer NOT NULL,
    anvandare character varying(20) NOT NULL,
    avsnitt integer,
    titel text,
    program_namn text,
    beskrivning text,
    url text,
    pub_datum_utc text,
    program_id text,
    betyg smallint
);


ALTER TABLE public.sparade_avsnitt OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16632)
-- Name: sparade_avsnitt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sparade_avsnitt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sparade_avsnitt_id_seq OWNER TO postgres;

--
-- TOC entry 3312 (class 0 OID 0)
-- Dependencies: 205
-- Name: sparade_avsnitt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sparade_avsnitt_id_seq OWNED BY public.sparade_avsnitt.id;


--
-- TOC entry 204 (class 1259 OID 16559)
-- Name: vanner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vanner (
    id integer NOT NULL,
    anvandare1 character varying(20) NOT NULL,
    anvandare2 character varying(20) NOT NULL,
    ny_fraga boolean DEFAULT true,
    godkann character varying(20) DEFAULT NULL::character varying
);


ALTER TABLE public.vanner OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16557)
-- Name: vanner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vanner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vanner_id_seq OWNER TO postgres;

--
-- TOC entry 3313 (class 0 OID 0)
-- Dependencies: 203
-- Name: vanner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vanner_id_seq OWNED BY public.vanner.id;


--
-- TOC entry 3147 (class 2604 OID 24677)
-- Name: programbetyg id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programbetyg ALTER COLUMN id SET DEFAULT nextval('public.programbetyg_id_seq'::regclass);


--
-- TOC entry 3142 (class 2604 OID 16539)
-- Name: rekommendationer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekommendationer ALTER COLUMN id SET DEFAULT nextval('public.rekommendationer_id_seq'::regclass);


--
-- TOC entry 3146 (class 2604 OID 16637)
-- Name: sparade_avsnitt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sparade_avsnitt ALTER COLUMN id SET DEFAULT nextval('public.sparade_avsnitt_id_seq'::regclass);


--
-- TOC entry 3143 (class 2604 OID 16562)
-- Name: vanner id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vanner ALTER COLUMN id SET DEFAULT nextval('public.vanner_id_seq'::regclass);


--
-- TOC entry 3296 (class 0 OID 16477)
-- Dependencies: 200
-- Data for Name: anvandare; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.anvandare (anvandarnamn, fornamn, efternamn, email, losenord, hemligt) FROM stdin;
Adam	Adam	Persson	\N	aaaaaaaa	f
Eva	Eva	Persson	\N	bbbbbbbb	f
www	www	www		$2b$08$TliqM23qyt43PpqGmtcPx.SnnuiNQ221OG2bBPU/bvFO54evdPmi6	f
bbb				$2b$08$muGLtKD1PbsHKKcQM13l3eRF86Tae4wws/10aeq9u7iJm1H2vnede	f
\.


--
-- TOC entry 3304 (class 0 OID 24674)
-- Dependencies: 208
-- Data for Name: programbetyg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.programbetyg (id, anvandare, programnamn, programid, betyg) FROM stdin;
\.


--
-- TOC entry 3298 (class 0 OID 16536)
-- Dependencies: 202
-- Data for Name: rekommendationer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rekommendationer (id, tipsare, mottagare, beskrivning, avsnitt) FROM stdin;
\.


--
-- TOC entry 3302 (class 0 OID 16634)
-- Dependencies: 206
-- Data for Name: sparade_avsnitt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sparade_avsnitt (id, anvandare, avsnitt, titel, program_namn, beskrivning, url, pub_datum_utc, program_id, betyg) FROM stdin;
\.


