DROP TABLE IF EXISTS anvandare CASCADE;
CREATE TABLE anvandare(
	anvandarnamn VARCHAR(20) UNIQUE NOT NULL,
	fornamn VARCHAR(20) NOT NULL,
	efternamn VARCHAR (20) NOT NULL,
	email varchar(35), 
	losenord VARCHAR(128) NOT NULL,
	PRIMARY KEY(anvandarnamn)
);

DROP TABLE IF EXISTS vanner;
CREATE TABLE vanner (
	id SERIAL,
	anvandare1 VARCHAR(20) NOT NULL, 
	anvandare2 VARCHAR(20) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fk_anvandare1
		FOREIGN KEY(anvandare1)
			REFERENCES anvandare(anvandarnamn),
	CONSTRAINT fk_anvandare2
		FOREIGN KEY(anvandare2)
			REFERENCES anvandare(anvandarnamn)
);

DROP TABLE IF EXISTS betyg;
CREATE TABLE betyg (
	id SERIAL,
	anvandare VARCHAR(20) NOT NULL, 
	avsnitt INTEGER,
	betyg SMALLINT,
	PRIMARY KEY(id),
	CONSTRAINT fk_anvandare
		FOREIGN KEY(anvandare)
			REFERENCES anvandare(anvandarnamn)
);

DROP TABLE IF EXISTS sparade_avsnitt;
CREATE TABLE sparade_avsnitt (
	id SERIAL,
	anvandare VARCHAR(20) NOT NULL, 
	avsnitt INTEGER,
	PRIMARY KEY(id),
	CONSTRAINT fk_anvandare
		FOREIGN KEY(anvandare)
			REFERENCES anvandare(anvandarnamn)
);

DROP TABLE IF EXISTS rekommendationer;
CREATE TABLE rekommendationer (
	id SERIAL,
	tipsare VARCHAR(20) NOT NULL, 
	mottagare VARCHAR(20) NOT NULL,
	beskrivning TEXT,
	avsnitt INTEGER,
	PRIMARY KEY(id),
	CONSTRAINT fk_tipsare
		FOREIGN KEY(tipsare)
			REFERENCES anvandare(anvandarnamn),
	CONSTRAINT fk_amottagare
		FOREIGN KEY(mottagare)
			REFERENCES anvandare(anvandarnamn)
);


