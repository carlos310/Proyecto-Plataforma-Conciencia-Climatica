--
-- PostgreSQL database dump
--

\restrict b78oYpj76w6BgYZddQciKjwUiMlSLj7Ogwt8twqu2tx75U62iaL5whJ7KlVQKeG

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-11-17 20:46:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16600)
-- Name: aqua_nova; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA aqua_nova;


ALTER SCHEMA aqua_nova OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 16602)
-- Name: cel; Type: DOMAIN; Schema: aqua_nova; Owner: postgres
--

CREATE DOMAIN aqua_nova.cel AS character varying(10)
	CONSTRAINT cel_check CHECK (((VALUE)::text ~ '^3[0-5][0-9]{8}$'::text));


ALTER DOMAIN aqua_nova.cel OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 16605)
-- Name: correo; Type: DOMAIN; Schema: aqua_nova; Owner: postgres
--

CREATE DOMAIN aqua_nova.correo AS text
	CONSTRAINT correo_check CHECK ((VALUE ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'::text));


ALTER DOMAIN aqua_nova.correo OWNER TO postgres;

--
-- TOC entry 262 (class 1255 OID 41717)
-- Name: create_factura_on_compra_insert(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.create_factura_on_compra_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO aqua_nova.facturas (
        fac_tipo,
        fac_referencia_id,
        fac_fecha,
        fac_total,
        fac_cantidad,
        fac_proveedor_cliente,
        usu_id,
        fac_estado
    ) VALUES (
        'COMPRA',
        NEW.cpr_id,
        NEW.cpr_fecha,
        NEW.cpr_total,
        NEW.cpr_cantidad,
        (SELECT prov_nombre FROM aqua_nova.proveedores WHERE prov_id = NEW.prov_id),
        NEW.usu_id,
        'PENDIENTE'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.create_factura_on_compra_insert() OWNER TO postgres;

--
-- TOC entry 263 (class 1255 OID 41719)
-- Name: create_factura_on_venta_insert(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.create_factura_on_venta_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO aqua_nova.facturas (
        fac_tipo,
        fac_referencia_id,
        fac_fecha,
        fac_total,
        fac_cantidad,
        fac_proveedor_cliente,
        usu_id,
        fac_estado
    ) VALUES (
        'VENTA',
        NEW.ven_id,
        NEW.ven_fecha,
        NEW.ven_total,
        NEW.ven_cantidad,
        COALESCE((SELECT CONCAT(cli_nombre, ' ', cli_apellido) FROM aqua_nova.clientes WHERE cli_id = NEW.cli_id), 'Cliente Contado'),
        NEW.usu_id,
        'PENDIENTE'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.create_factura_on_venta_insert() OWNER TO postgres;

--
-- TOC entry 250 (class 1255 OID 16981)
-- Name: log_usuario_borrado(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.log_usuario_borrado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO aqua_nova.auditoria_usuarios (usu_id, usu_nombre, usu_email, usu_contrasena)
    VALUES (OLD.usu_id, OLD.usu_nombre, OLD.usu_email, OLD.usu_contrasena);
    RETURN OLD;
END;
$$;


ALTER FUNCTION aqua_nova.log_usuario_borrado() OWNER TO postgres;

--
-- TOC entry 249 (class 1255 OID 41664)
-- Name: sync_cliente_rol_on_insert(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.sync_cliente_rol_on_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.cli_rol := (SELECT usu_rol FROM aqua_nova.usuarios WHERE usu_id = NEW.usu_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.sync_cliente_rol_on_insert() OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 41666)
-- Name: sync_cliente_rol_on_update(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.sync_cliente_rol_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.usu_id IS NOT NULL THEN
        NEW.cli_rol := (SELECT usu_rol FROM aqua_nova.usuarios WHERE usu_id = NEW.usu_id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.sync_cliente_rol_on_update() OWNER TO postgres;

--
-- TOC entry 254 (class 1255 OID 41672)
-- Name: sync_clientes_rol_on_usuario_update(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.sync_clientes_rol_on_usuario_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.usu_rol != OLD.usu_rol THEN
        UPDATE aqua_nova.clientes
        SET cli_rol = NEW.usu_rol
        WHERE usu_id = NEW.usu_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.sync_clientes_rol_on_usuario_update() OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 41668)
-- Name: sync_empleado_rol_on_insert(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.sync_empleado_rol_on_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.emp_rol := (SELECT usu_rol FROM aqua_nova.usuarios WHERE usu_id = NEW.usu_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.sync_empleado_rol_on_insert() OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 41670)
-- Name: sync_empleado_rol_on_update(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.sync_empleado_rol_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.usu_id IS NOT NULL THEN
        NEW.emp_rol := (SELECT usu_rol FROM aqua_nova.usuarios WHERE usu_id = NEW.usu_id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.sync_empleado_rol_on_update() OWNER TO postgres;

--
-- TOC entry 255 (class 1255 OID 41674)
-- Name: sync_empleados_rol_on_usuario_update(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.sync_empleados_rol_on_usuario_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.usu_rol != OLD.usu_rol THEN
        UPDATE aqua_nova.empleados
        SET emp_rol = NEW.usu_rol
        WHERE usu_id = NEW.usu_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.sync_empleados_rol_on_usuario_update() OWNER TO postgres;

--
-- TOC entry 258 (class 1255 OID 41680)
-- Name: update_stock_on_compra_delete(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.update_stock_on_compra_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE aqua_nova.productos
    SET prod_stock = CAST(prod_stock AS INTEGER) - OLD.chp_cantidad
    WHERE prod_id = OLD.prod_id;
    RETURN OLD;
END;
$$;


ALTER FUNCTION aqua_nova.update_stock_on_compra_delete() OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 41676)
-- Name: update_stock_on_compra_insert(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.update_stock_on_compra_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE aqua_nova.productos
    SET prod_stock = CAST(prod_stock AS INTEGER) + NEW.chp_cantidad
    WHERE prod_id = NEW.prod_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.update_stock_on_compra_insert() OWNER TO postgres;

--
-- TOC entry 257 (class 1255 OID 41678)
-- Name: update_stock_on_compra_update(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.update_stock_on_compra_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.chp_cantidad != OLD.chp_cantidad THEN
        UPDATE aqua_nova.productos
        SET prod_stock = CAST(prod_stock AS INTEGER) - OLD.chp_cantidad + NEW.chp_cantidad
        WHERE prod_id = NEW.prod_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.update_stock_on_compra_update() OWNER TO postgres;

--
-- TOC entry 261 (class 1255 OID 41686)
-- Name: update_stock_on_venta_delete(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.update_stock_on_venta_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE aqua_nova.productos
    SET prod_stock = CAST(prod_stock AS INTEGER) + OLD.phv_cantidad
    WHERE prod_id = OLD.prod_id;
    RETURN OLD;
END;
$$;


ALTER FUNCTION aqua_nova.update_stock_on_venta_delete() OWNER TO postgres;

--
-- TOC entry 259 (class 1255 OID 41682)
-- Name: update_stock_on_venta_insert(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.update_stock_on_venta_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE aqua_nova.productos
    SET prod_stock = CAST(prod_stock AS INTEGER) - NEW.phv_cantidad
    WHERE prod_id = NEW.prod_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.update_stock_on_venta_insert() OWNER TO postgres;

--
-- TOC entry 260 (class 1255 OID 41684)
-- Name: update_stock_on_venta_update(); Type: FUNCTION; Schema: aqua_nova; Owner: postgres
--

CREATE FUNCTION aqua_nova.update_stock_on_venta_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.phv_cantidad != OLD.phv_cantidad THEN
        UPDATE aqua_nova.productos
        SET prod_stock = CAST(prod_stock AS INTEGER) + OLD.phv_cantidad - NEW.phv_cantidad
        WHERE prod_id = NEW.prod_id;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION aqua_nova.update_stock_on_venta_update() OWNER TO postgres;

--
-- TOC entry 248 (class 1255 OID 16979)
-- Name: log_usuario_borrado(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_usuario_borrado() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO auditoria_usuarios (usu_id, usu_nombre, usu_email, usu_contrasena)
    VALUES (OLD.usu_id, OLD.usu_nombre, OLD.usu_email, OLD.usu_contrasena);
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.log_usuario_borrado() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 241 (class 1259 OID 16970)
-- Name: auditoria_usuarios; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.auditoria_usuarios (
    id integer NOT NULL,
    usu_id integer,
    usu_nombre character varying(45),
    usu_email text,
    usu_contrasena character varying(255),
    fecha_borrado timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE aqua_nova.auditoria_usuarios OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16969)
-- Name: auditoria_usuarios_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.auditoria_usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME aqua_nova.auditoria_usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16607)
-- Name: clientes; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.clientes (
    cli_id integer NOT NULL,
    cli_nombre character varying(70),
    cli_apellido character varying(70),
    cli_email aqua_nova.correo NOT NULL,
    cli_telefono aqua_nova.cel NOT NULL,
    cli_direccion character varying(100),
    usu_id integer,
    cli_rol character varying(45)
);


ALTER TABLE aqua_nova.clientes OWNER TO postgres;

--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN clientes.cli_rol; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.clientes.cli_rol IS 'Rol heredado de usuarios.usu_rol (sincronizado vía TRIGGER)';


--
-- TOC entry 221 (class 1259 OID 16615)
-- Name: clientes_cli_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.clientes ALTER COLUMN cli_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.clientes_cli_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 245 (class 1259 OID 41626)
-- Name: compra_has_productos; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.compra_has_productos (
    chp_id integer NOT NULL,
    cpr_id integer NOT NULL,
    prod_id integer NOT NULL,
    chp_cantidad integer NOT NULL,
    chp_precio_unitario numeric(10,2) NOT NULL,
    chp_subtotal numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE aqua_nova.compra_has_productos OWNER TO postgres;

--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE compra_has_productos; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON TABLE aqua_nova.compra_has_productos IS 'Relación M:M entre compras y productos con detalle de cantidad y precio';


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN compra_has_productos.chp_cantidad; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.compra_has_productos.chp_cantidad IS 'Cantidad de este producto en esta compra';


--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN compra_has_productos.chp_precio_unitario; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.compra_has_productos.chp_precio_unitario IS 'Precio unitario en el momento de la compra';


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN compra_has_productos.chp_subtotal; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.compra_has_productos.chp_subtotal IS 'chp_cantidad × chp_precio_unitario';


--
-- TOC entry 244 (class 1259 OID 41625)
-- Name: compra_has_productos_chp_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

CREATE SEQUENCE aqua_nova.compra_has_productos_chp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE aqua_nova.compra_has_productos_chp_id_seq OWNER TO postgres;

--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 244
-- Name: compra_has_productos_chp_id_seq; Type: SEQUENCE OWNED BY; Schema: aqua_nova; Owner: postgres
--

ALTER SEQUENCE aqua_nova.compra_has_productos_chp_id_seq OWNED BY aqua_nova.compra_has_productos.chp_id;


--
-- TOC entry 239 (class 1259 OID 16870)
-- Name: compras; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.compras (
    cpr_id integer NOT NULL,
    cpr_total numeric NOT NULL,
    cpr_cantidad integer NOT NULL,
    cpr_fecha date NOT NULL,
    usu_id integer NOT NULL,
    prov_id integer NOT NULL
);


ALTER TABLE aqua_nova.compras OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN compras.prov_id; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.compras.prov_id IS 'FK a proveedores - a qué proveedor le compramos';


--
-- TOC entry 238 (class 1259 OID 16869)
-- Name: compras_cpr_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

CREATE SEQUENCE aqua_nova.compras_cpr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE aqua_nova.compras_cpr_id_seq OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 238
-- Name: compras_cpr_id_seq; Type: SEQUENCE OWNED BY; Schema: aqua_nova; Owner: postgres
--

ALTER SEQUENCE aqua_nova.compras_cpr_id_seq OWNED BY aqua_nova.compras.cpr_id;


--
-- TOC entry 222 (class 1259 OID 16628)
-- Name: costos; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.costos (
    cos_id integer NOT NULL,
    cos_descripcion character varying(45) NOT NULL,
    cos_monto numeric NOT NULL,
    cos_fecha date NOT NULL,
    cos_fuente character varying(45) NOT NULL,
    emp_id integer NOT NULL,
    usu_id integer NOT NULL
);


ALTER TABLE aqua_nova.costos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16632)
-- Name: costos_cos_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.costos ALTER COLUMN cos_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.costos_cos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 16633)
-- Name: empleados; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.empleados (
    emp_id integer NOT NULL,
    emp_nombre character varying(70),
    emp_apellido character varying(70),
    emp_cargo character varying(45),
    emp_salario numeric(10,2),
    emp_fecha_contratacion date,
    usu_id integer,
    emp_rol character varying(45)
);


ALTER TABLE aqua_nova.empleados OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN empleados.emp_rol; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.empleados.emp_rol IS 'Rol heredado de usuarios.usu_rol (sincronizado vía TRIGGER)';


--
-- TOC entry 225 (class 1259 OID 16637)
-- Name: empleados_emp_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.empleados ALTER COLUMN emp_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.empleados_emp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 247 (class 1259 OID 41689)
-- Name: facturas; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.facturas (
    fac_id integer NOT NULL,
    fac_tipo character varying(45) NOT NULL,
    fac_referencia_id integer NOT NULL,
    fac_fecha date NOT NULL,
    fac_total numeric(10,2) NOT NULL,
    fac_cantidad integer NOT NULL,
    fac_estado character varying(45) DEFAULT 'PENDIENTE'::character varying,
    fac_proveedor_cliente character varying(100),
    usu_id integer NOT NULL,
    fac_lote_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT facturas_fac_estado_check CHECK (((fac_estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'PAGADA'::character varying, 'CANCELADA'::character varying])::text[]))),
    CONSTRAINT facturas_fac_tipo_check CHECK (((fac_tipo)::text = ANY ((ARRAY['COMPRA'::character varying, 'VENTA'::character varying])::text[])))
);


ALTER TABLE aqua_nova.facturas OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE facturas; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON TABLE aqua_nova.facturas IS 'Tabla que agrupa compras y ventas para revisión y auditoría por lotes';


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN facturas.fac_tipo; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.facturas.fac_tipo IS 'Tipo de transacción: COMPRA o VENTA';


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN facturas.fac_referencia_id; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.facturas.fac_referencia_id IS 'ID de la compra o venta relacionada';


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN facturas.fac_estado; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.facturas.fac_estado IS 'Estado de pago: PENDIENTE, PAGADA, CANCELADA';


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN facturas.fac_lote_id; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.facturas.fac_lote_id IS 'Para agrupar múltiples facturas en un lote de auditoría';


--
-- TOC entry 246 (class 1259 OID 41688)
-- Name: facturas_fac_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

CREATE SEQUENCE aqua_nova.facturas_fac_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE aqua_nova.facturas_fac_id_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 246
-- Name: facturas_fac_id_seq; Type: SEQUENCE OWNED BY; Schema: aqua_nova; Owner: postgres
--

ALTER SEQUENCE aqua_nova.facturas_fac_id_seq OWNED BY aqua_nova.facturas.fac_id;


--
-- TOC entry 226 (class 1259 OID 16638)
-- Name: gastos; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.gastos (
    gas_id integer NOT NULL,
    gas_descripcion character varying(45) NOT NULL,
    gas_monto numeric NOT NULL,
    gas_fecha date NOT NULL,
    emp_id integer NOT NULL,
    usu_id integer NOT NULL
);


ALTER TABLE aqua_nova.gastos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16645)
-- Name: gastos_gas_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.gastos ALTER COLUMN gas_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.gastos_gas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 16646)
-- Name: ingresos; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.ingresos (
    ing_id integer NOT NULL,
    ing_descripcion character varying(45) NOT NULL,
    ing_monto numeric NOT NULL,
    ing_fecha date NOT NULL,
    ing_fuente character varying(45) NOT NULL,
    usu_id integer NOT NULL
);


ALTER TABLE aqua_nova.ingresos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16650)
-- Name: ingresos_ing_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.ingresos ALTER COLUMN ing_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.ingresos_ing_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 16651)
-- Name: productos; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.productos (
    prod_id integer NOT NULL,
    prod_nombre character varying(45) NOT NULL,
    prod_descripcion character varying(45) NOT NULL,
    prod_precio_venta numeric NOT NULL,
    prod_precio_compra numeric NOT NULL,
    prod_stock character varying(40) NOT NULL,
    prod_categoria character varying(45) NOT NULL,
    prov_id integer
);


ALTER TABLE aqua_nova.productos OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN productos.prov_id; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.productos.prov_id IS 'FK a proveedores - de qué proveedor es este producto';


--
-- TOC entry 231 (class 1259 OID 16655)
-- Name: productos_has_ventas; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.productos_has_ventas (
    phv_id integer NOT NULL,
    ven_id integer NOT NULL,
    prod_id integer NOT NULL,
    phv_cantidad integer,
    phv_precio_unitario numeric(10,2),
    phv_subtotal numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE aqua_nova.productos_has_ventas OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE productos_has_ventas; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON TABLE aqua_nova.productos_has_ventas IS 'Relación M:M entre ventas y productos con detalle de cantidad y precio';


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN productos_has_ventas.phv_cantidad; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.productos_has_ventas.phv_cantidad IS 'Cantidad de este producto vendido en esta venta';


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN productos_has_ventas.phv_precio_unitario; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.productos_has_ventas.phv_precio_unitario IS 'Precio unitario en el momento de la venta';


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN productos_has_ventas.phv_subtotal; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.productos_has_ventas.phv_subtotal IS 'phv_cantidad × phv_precio_unitario';


--
-- TOC entry 232 (class 1259 OID 16661)
-- Name: productos_has_ventas_phv_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.productos_has_ventas ALTER COLUMN phv_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.productos_has_ventas_phv_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 16662)
-- Name: productos_prod_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.productos ALTER COLUMN prod_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.productos_prod_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 243 (class 1259 OID 41595)
-- Name: proveedores; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.proveedores (
    prov_id integer NOT NULL,
    prov_nombre character varying(100) NOT NULL,
    prov_email aqua_nova.correo,
    prov_telefono aqua_nova.cel,
    prov_direccion character varying(100),
    prov_ciudad character varying(45),
    prov_pais character varying(45),
    prov_contacto character varying(70),
    prov_estado character varying(20) DEFAULT 'ACTIVO'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE aqua_nova.proveedores OWNER TO postgres;

--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE proveedores; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON TABLE aqua_nova.proveedores IS 'Tabla de proveedores de productos';


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN proveedores.prov_id; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.proveedores.prov_id IS 'ID único del proveedor';


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN proveedores.prov_nombre; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.proveedores.prov_nombre IS 'Nombre del proveedor (único)';


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN proveedores.prov_estado; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.proveedores.prov_estado IS 'Estado del proveedor: ACTIVO o INACTIVO';


--
-- TOC entry 242 (class 1259 OID 41594)
-- Name: proveedores_prov_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

CREATE SEQUENCE aqua_nova.proveedores_prov_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE aqua_nova.proveedores_prov_id_seq OWNER TO postgres;

--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 242
-- Name: proveedores_prov_id_seq; Type: SEQUENCE OWNED BY; Schema: aqua_nova; Owner: postgres
--

ALTER SEQUENCE aqua_nova.proveedores_prov_id_seq OWNED BY aqua_nova.proveedores.prov_id;


--
-- TOC entry 234 (class 1259 OID 16663)
-- Name: usuarios; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.usuarios (
    usu_id integer NOT NULL,
    usu_nombre character varying(45) NOT NULL,
    usu_email aqua_nova.correo NOT NULL,
    usu_contrasena character varying(100),
    usu_rol character varying(45) NOT NULL
);


ALTER TABLE aqua_nova.usuarios OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16670)
-- Name: usuarios_usu_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.usuarios ALTER COLUMN usu_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.usuarios_usu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 16671)
-- Name: ventas; Type: TABLE; Schema: aqua_nova; Owner: postgres
--

CREATE TABLE aqua_nova.ventas (
    ven_id integer NOT NULL,
    ven_total numeric(10,2) NOT NULL,
    ven_cantidad integer,
    ven_fecha date,
    usu_id integer,
    cli_id integer
);


ALTER TABLE aqua_nova.ventas OWNER TO postgres;

--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN ventas.cli_id; Type: COMMENT; Schema: aqua_nova; Owner: postgres
--

COMMENT ON COLUMN aqua_nova.ventas.cli_id IS 'FK a clientes - cliente al que se le vendió (NULL = venta al contado)';


--
-- TOC entry 237 (class 1259 OID 16676)
-- Name: ventas_ven_id_seq; Type: SEQUENCE; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE aqua_nova.ventas ALTER COLUMN ven_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME aqua_nova.ventas_ven_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4953 (class 2604 OID 41629)
-- Name: compra_has_productos chp_id; Type: DEFAULT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compra_has_productos ALTER COLUMN chp_id SET DEFAULT nextval('aqua_nova.compra_has_productos_chp_id_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 16873)
-- Name: compras cpr_id; Type: DEFAULT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compras ALTER COLUMN cpr_id SET DEFAULT nextval('aqua_nova.compras_cpr_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 41692)
-- Name: facturas fac_id; Type: DEFAULT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.facturas ALTER COLUMN fac_id SET DEFAULT nextval('aqua_nova.facturas_fac_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 41598)
-- Name: proveedores prov_id; Type: DEFAULT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.proveedores ALTER COLUMN prov_id SET DEFAULT nextval('aqua_nova.proveedores_prov_id_seq'::regclass);


--
-- TOC entry 5209 (class 0 OID 16970)
-- Dependencies: 241
-- Data for Name: auditoria_usuarios; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.auditoria_usuarios (id, usu_id, usu_nombre, usu_email, usu_contrasena, fecha_borrado) FROM stdin;
1	9	Maria Juarez	maria.t@gmail.com	$2b$12$PS2Wyo7a11od7htRFVb7X.RvldSpcwBuXhfxnCNibpTs7BC2s.Cc2	2026-06-27 04:07:44.2417
2	16	Usuario Prueba	prueba.borrar.1793149893@ejemplo.com	$2b$12$qeoH2yefAvpZ.IE2MbqsFe4ztYiwIAoaUsC1W8mhUmtj8diOFJ/tO	2026-10-27 20:11:35.189634
3	17	Usuario Editado	prueba.borrar.1793149902@ejemplo.com	$2b$12$lSGYrBzg6re2LJF35jn1dOBNHIdNJlBts7IpDrJs7z66JSHmSM3K.	2026-10-27 20:11:44.516421
4	18	Usuario Clave	prueba.clave.1793150092@ejemplo.com	$2b$12$DwmI5rLMF.ZOPelHgJmCjuij4lOOQA1DslGQoKlTIos25guM/6Tc2	2026-10-27 20:14:54.136984
5	19	Usuario Repro	prueba.repro.1793150181435@ejemplo.com	$2b$12$LXbWoicst1wF9s6aDHHZueGfYZaj1578jjIjj6YU7BW2yYlczMlnq	2026-10-27 20:16:35.591369
6	20	Usuario Repro	prueba.repro.1793150201724@ejemplo.com	$2b$12$DXqonY/WANIVUIcWdL.HzeQZzn58sQgwo6L2YCT4Mm.RPEwIbzR7S	2026-10-27 20:16:55.858361
7	21	Usuario Repro	prueba.repro.1793150222705@ejemplo.com	$2b$12$f59tJnUdd026KRYjrWIp6.3Jj3937e/goq9jWJTqIJl6IIRRvIaeO	2026-10-27 20:17:16.831189
8	22	Usuario Repro	prueba.repro.1793150245150@ejemplo.com	$2b$12$moYwKndC7Ax6LZ6iAYexOuvWpKvPBdy.7.a.vPtS3vyyirQ1S/Uby	2026-10-27 20:17:39.307017
9	23	Usuario Repro	prueba.repro.1793150275866@ejemplo.com	$2b$12$eW9Xs5fa3oM3MM8GuJJ9uu/GPFlPC3XHeMksibU3OfTp/UGvF0IeW	2026-10-27 20:18:10.036617
10	24	Usuario Repro	prueba.repro.1793150300930@ejemplo.com	$2b$12$Oma8GQO/vTOuV3UDZXf4ruABncKRCmEQid7tuS53V7ackzweKrU9W	2026-10-27 20:18:35.05848
11	25	Usuario Repro	prueba.repro.1793150335479@ejemplo.com	$2b$12$I/.iD1DzSRZv4IeccvFrpOF7rFv1TFBe2M.5jQu70B9.TzhASkR9i	2026-10-27 20:19:09.686746
12	26	Usuario Repro	prueba.repro.1793151395155@ejemplo.com	$2b$12$CrQhwCiYFzzLg7t4Amt8ueNx5GvzzVuzFxkEzPFiY7SZhOCuW7Ttq	2026-10-27 20:36:49.41451
13	28	Prueba cliente	rol.cliente.1793232795@ejemplo.com	$2b$12$t//yh45x5nEdxCvjXtumfOjMayDutGy1ompilnBQA815.Da8kDOI2	2026-10-28 19:13:39.359119
14	29	Prueba empleado	rol.empleado.1793232795@ejemplo.com	$2b$12$9/PinOS/OULLM4O/WAkC/OajEHTw/VYrOX162qEWPfu32w.8w.xdK	2026-10-28 19:13:39.416939
15	30	Prueba admin	rol.admin.1793232795@ejemplo.com	$2b$12$7RG5kRQM6qpYPkPthLkS1.7mJ6jQaMKLesWJ9blRvujDHtyAYEfcK	2026-10-28 19:13:39.467296
\.


--
-- TOC entry 5188 (class 0 OID 16607)
-- Dependencies: 220
-- Data for Name: clientes; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.clientes (cli_id, cli_nombre, cli_apellido, cli_email, cli_telefono, cli_direccion, usu_id, cli_rol) FROM stdin;
1	Maria	Delgado	maria.d@mail.com	3115551234	Calle 45 #12-34, Bogotá	4	\N
2	Jorge	Martinez	jorge.m@mail.com	3124445656	Av. Siempre Viva 742	5	\N
3	Lucia	Fernandez	lucia.f@mail.com	3209998899	Carrera 10 #5-20	4	\N
4	Andres	Palacios	andres.p@mail.com	3157773387	Calle 80 #68-10	5	\N
5	Elena	Rios	elena.rios@mail.com	3002221153	Diagonal 4 #2-80	4	\N
6	Cliente test	test	clientetest2@email.com	3223068355	Cr 8 #4-29 Barrio el Trébol	31	Admin
\.


--
-- TOC entry 5213 (class 0 OID 41626)
-- Dependencies: 245
-- Data for Name: compra_has_productos; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.compra_has_productos (chp_id, cpr_id, prod_id, chp_cantidad, chp_precio_unitario, chp_subtotal, created_at) FROM stdin;
\.


--
-- TOC entry 5207 (class 0 OID 16870)
-- Dependencies: 239
-- Data for Name: compras; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.compras (cpr_id, cpr_total, cpr_cantidad, cpr_fecha, usu_id, prov_id) FROM stdin;
2	20000	3	2026-11-16	31	4
\.


--
-- TOC entry 5190 (class 0 OID 16628)
-- Dependencies: 222
-- Data for Name: costos; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.costos (cos_id, cos_descripcion, cos_monto, cos_fecha, cos_fuente, emp_id, usu_id) FROM stdin;
1	Materia prima - Plástico PET	2500.00	2026-05-01	Desconocido	1	1
2	Pago de mano de obra destajista	800.00	2026-05-05	Desconocido	5	1
3	Mantenimiento maquinaria de soplado	650.00	2026-05-12	Desconocido	4	2
4	Flete de distribución de producto terminado	450.00	2026-05-18	Desconocido	3	3
5	Empaques y etiquetas de seguridad	300.00	2026-05-22	Desconocido	2	2
7	test 2	20	2026-11-01	test2	5	4
8	test6	20	2026-11-16	test2	3	2
\.


--
-- TOC entry 5192 (class 0 OID 16633)
-- Dependencies: 224
-- Data for Name: empleados; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.empleados (emp_id, emp_nombre, emp_apellido, emp_cargo, emp_salario, emp_fecha_contratacion, usu_id, emp_rol) FROM stdin;
1	Carlos	Mendoza	Gerente General	4500.00	2024-01-15	1	\N
2	Ana	Gomez	Cajera	1200.00	2024-03-01	2	\N
3	Luis	Rodriguez	Asesor de Ventas	1400.00	2024-06-10	3	\N
4	Sofia	Castro	Soporte Técnico	1300.00	2025-02-20	2	\N
5	Pedro	Peña	Supervisor	2000.00	2023-11-01	1	\N
\.


--
-- TOC entry 5215 (class 0 OID 41689)
-- Dependencies: 247
-- Data for Name: facturas; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.facturas (fac_id, fac_tipo, fac_referencia_id, fac_fecha, fac_total, fac_cantidad, fac_estado, fac_proveedor_cliente, usu_id, fac_lote_id, created_at, updated_at) FROM stdin;
1	COMPRA	2	2026-11-16	20000.00	3	PENDIENTE	proveedor test	31	\N	2026-11-16 23:13:47.951514	2026-11-16 23:13:47.951514
4	COMPRA	2	2026-11-16	20000.00	3	PAGADA	Juan Test	31	2345	2026-11-16 23:33:48.600515	2026-11-16 23:33:48.600515
5	COMPRA	2	2026-11-04	30000.00	3	PAGADA	Juan Test	31	2345	2026-11-17 20:26:19.501139	2026-11-17 20:26:19.501139
\.


--
-- TOC entry 5194 (class 0 OID 16638)
-- Dependencies: 226
-- Data for Name: gastos; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.gastos (gas_id, gas_descripcion, gas_monto, gas_fecha, emp_id, usu_id) FROM stdin;
1	Pago de servicio público energía	350.00	2026-05-02	1	1
2	Compra de papelería e insumos de oficina	85.50	2026-05-10	2	2
3	Mantenimiento preventivo aire acondicionado	120.00	2026-05-15	4	1
4	Transporte y viáticos entrega especial	45.00	2026-05-20	3	3
5	Cafetería y agua para personal	60.00	2026-05-25	5	2
\.


--
-- TOC entry 5196 (class 0 OID 16646)
-- Dependencies: 228
-- Data for Name: ingresos; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.ingresos (ing_id, ing_descripcion, ing_monto, ing_fecha, ing_fuente, usu_id) FROM stdin;
1	Venta directa de mercancía	15000000.00	2026-05-25	Punto de Venta 1	1
2	Suscripción mensual servicio Premium	4500000.00	2026-05-26	Plataforma Web	1
4	Asesoría técnica corporativa	1200000.00	2026-05-28	Contrato Externo	3
3	Auditoría de huella hídrica corporativa	752500.00	2026-05-27	Consultoria	2
5	Venta de software de monitoreo de caudal	1800000.00	2026-05-29	Licenciamiento	2
7	test 2	23	2026-11-03	test2	2
\.


--
-- TOC entry 5198 (class 0 OID 16651)
-- Dependencies: 230
-- Data for Name: productos; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.productos (prod_id, prod_nombre, prod_descripcion, prod_precio_venta, prod_precio_compra, prod_stock, prod_categoria, prov_id) FROM stdin;
1	Sensor de Humedad IoT	Monitorea el suelo para evitar riego excesivo	70.00	35.00	120	Dispositivos	\N
2	Grifería Eco-Flujo Oro	Reductor de caudal automático para lavamanos	90.00	45.00	200	Ahorradores	\N
3	Kit de Filtración Casero	Filtro de tres etapas para aguas grises	450.00	280.00	25	Tratamiento	\N
4	Electroválvula Inteligente 1"	Cierre automatizado en caso de fugas	150.00	80.00	60	Automatización	\N
5	Medidor de Flujo Ultrasónico	Detecta microfugas en tuberías principales	600.00	390.00	14	Dispositivos	\N
7	Producto Prueba	desc prueba	10	5	3	Categoria Prueba	\N
9	Bano portatil	test 2	20	10	1	Dispositivos	\N
\.


--
-- TOC entry 5199 (class 0 OID 16655)
-- Dependencies: 231
-- Data for Name: productos_has_ventas; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.productos_has_ventas (phv_id, ven_id, prod_id, phv_cantidad, phv_precio_unitario, phv_subtotal, created_at) FROM stdin;
1	1	1	\N	\N	\N	2026-11-16 15:48:12.237552
2	2	2	\N	\N	\N	2026-11-16 15:48:12.237552
3	3	3	\N	\N	\N	2026-11-16 15:48:12.237552
4	4	4	\N	\N	\N	2026-11-16 15:48:12.237552
5	5	5	\N	\N	\N	2026-11-16 15:48:12.237552
\.


--
-- TOC entry 5211 (class 0 OID 41595)
-- Dependencies: 243
-- Data for Name: proveedores; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.proveedores (prov_id, prov_nombre, prov_email, prov_telefono, prov_direccion, prov_ciudad, prov_pais, prov_contacto, prov_estado, created_at, updated_at) FROM stdin;
3	Maria Juarez	darioi203@hotmail.com	3016017137	Calle 127a #51a-90 Niza IX portería 2 apto 409	Bogota	Colombia	contacto test	activo	2026-11-16 23:04:39.32213	2026-11-16 23:04:39.32213
4	proveedor test	testest@prov.com	3223068356	Cr 8 #4-29 Barrio el Trébol	Bogota	Colombia	contacto test	activo	2026-11-16 23:12:36.504879	2026-11-16 23:12:36.504879
\.


--
-- TOC entry 5202 (class 0 OID 16663)
-- Dependencies: 234
-- Data for Name: usuarios; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.usuarios (usu_id, usu_nombre, usu_email, usu_contrasena, usu_rol) FROM stdin;
1	Carlos Mendoza	carlos.m@mail.com	scrypt_a1b2	Administrador
3	Luis Rodriguez	luis.r@mail.com	argon2_5e6f	Empleado
6	Carlos	carlos@example.com	E123456m*	admin
7	Lizeth	test@email.com	Test122*	admin
8	Carlos Prueba	test10@email.com	$2b$12$YHbb5otVNk9KQe7.p.jbr.C9B7unAyLWNO3qhq1lKwUF1Cp.neFBm	Empleado
10	testadmin	testad@email.com	$2b$12$kdNn3rvVExkU/7CTRFhW6ekZDrK7ryY1R43yFa9tchGIarwSLtgtu	admin
2	Ana Gomez	ana.g@mail.com	Test1245*	Empleado
5	Jorge Martinez	jorge.m@mail.com	Endlessnight1*	Cliente
11	testcliente	testcli@email.com	$2b$12$Ojc0dsg3NZ6wKLbFXz732Oj5Or/Ryo7dcpZQ12FQ5XJDpuxeKGGnS	Cliente
12	Maria lujan	amortest@test.com	$2b$12$HSM10Dspz9UnUM0z13kaJuVidZt3ywWprkgVeS4OC6ZKFPqP5Y6G6	Empleado
13	Ana Gomez	paria.t@gmail.com	$2b$12$8OBN4UYQCdhzuK13hkGFv.8.ChA6gSN/recmv43Kv5sqhL0BihFwu	Admin
14	Ana Gom	mapu.t@gmail.com	$2b$12$HIWA7c5qa3Fw5PtboGILfOuRB72pya2Krnf6NmacEOn/D/sG1gCVW	Admin
15	Juan p	testa.t@gmail.com	$2b$12$5Iqf1.7Xq1j5mrOLHgqUv.DY8u1h0OVeoaB1Zdno4E7hjmuSp8MDq	Admin
4	Maria Delgadas	maria.d@mail.com	$2b$12$nBl2j9r9hCofBelBBDFJweEPdJwJp7zz8OqkkHris0jcWoUZw4m0y	Cliente
27	test	test2@gmail.com	$2b$12$MmZRQ2B7BuXVf23/i93Py.48WeDoVnt097F2l2v4KywoY1gmXpQlW	Cliente
31	Admin Prueba	admin@email.com	$2b$12$9r/AaXjwy4.HBWXRvbhAQuY3yIithcENS9D2zLaom3jfQ64QEVJBC	Admin
\.


--
-- TOC entry 5204 (class 0 OID 16671)
-- Dependencies: 236
-- Data for Name: ventas; Type: TABLE DATA; Schema: aqua_nova; Owner: postgres
--

COPY aqua_nova.ventas (ven_id, ven_total, ven_cantidad, ven_fecha, usu_id, cli_id) FROM stdin;
2	45.50	1	2026-05-27	2	\N
3	320.00	8	2026-05-27	3	\N
4	850.00	20	2026-05-28	2	\N
5	60.00	2	2026-05-29	3	\N
1	150.00	3	2026-05-26	1	2
\.


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 240
-- Name: auditoria_usuarios_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.auditoria_usuarios_id_seq', 15, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 221
-- Name: clientes_cli_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.clientes_cli_id_seq', 6, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 244
-- Name: compra_has_productos_chp_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.compra_has_productos_chp_id_seq', 1, false);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 238
-- Name: compras_cpr_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.compras_cpr_id_seq', 2, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 223
-- Name: costos_cos_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.costos_cos_id_seq', 8, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 225
-- Name: empleados_emp_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.empleados_emp_id_seq', 5, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 246
-- Name: facturas_fac_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.facturas_fac_id_seq', 5, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 227
-- Name: gastos_gas_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.gastos_gas_id_seq', 6, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 229
-- Name: ingresos_ing_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.ingresos_ing_id_seq', 7, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 232
-- Name: productos_has_ventas_phv_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.productos_has_ventas_phv_id_seq', 5, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 233
-- Name: productos_prod_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.productos_prod_id_seq', 9, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 242
-- Name: proveedores_prov_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.proveedores_prov_id_seq', 4, true);


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 235
-- Name: usuarios_usu_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.usuarios_usu_id_seq', 31, true);


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 237
-- Name: ventas_ven_id_seq; Type: SEQUENCE SET; Schema: aqua_nova; Owner: postgres
--

SELECT pg_catalog.setval('aqua_nova.ventas_ven_id_seq', 5, true);


--
-- TOC entry 4992 (class 2606 OID 16883)
-- Name: compras PK_ae5982b3d3749ac01cf88fbac6e; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compras
    ADD CONSTRAINT "PK_ae5982b3d3749ac01cf88fbac6e" PRIMARY KEY (cpr_id);


--
-- TOC entry 4995 (class 2606 OID 16978)
-- Name: auditoria_usuarios auditoria_usuarios_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.auditoria_usuarios
    ADD CONSTRAINT auditoria_usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 16678)
-- Name: clientes clientes_cli_email_key; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.clientes
    ADD CONSTRAINT clientes_cli_email_key UNIQUE (cli_email);


--
-- TOC entry 4964 (class 2606 OID 16680)
-- Name: clientes clientes_cli_telefono_key; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.clientes
    ADD CONSTRAINT clientes_cli_telefono_key UNIQUE (cli_telefono);


--
-- TOC entry 4966 (class 2606 OID 16682)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (cli_id);


--
-- TOC entry 5003 (class 2606 OID 41640)
-- Name: compra_has_productos compra_has_productos_cpr_id_prod_id_key; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compra_has_productos
    ADD CONSTRAINT compra_has_productos_cpr_id_prod_id_key UNIQUE (cpr_id, prod_id);


--
-- TOC entry 5005 (class 2606 OID 41638)
-- Name: compra_has_productos compra_has_productos_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compra_has_productos
    ADD CONSTRAINT compra_has_productos_pkey PRIMARY KEY (chp_id);


--
-- TOC entry 4968 (class 2606 OID 16688)
-- Name: costos costos_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.costos
    ADD CONSTRAINT costos_pkey PRIMARY KEY (cos_id);


--
-- TOC entry 4970 (class 2606 OID 16690)
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (emp_id);


--
-- TOC entry 5009 (class 2606 OID 41706)
-- Name: facturas facturas_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (fac_id);


--
-- TOC entry 4972 (class 2606 OID 16692)
-- Name: gastos gastos_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.gastos
    ADD CONSTRAINT gastos_pkey PRIMARY KEY (gas_id);


--
-- TOC entry 4974 (class 2606 OID 16694)
-- Name: ingresos ingresos_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.ingresos
    ADD CONSTRAINT ingresos_pkey PRIMARY KEY (ing_id);


--
-- TOC entry 4981 (class 2606 OID 16696)
-- Name: productos_has_ventas productos_has_ventas_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.productos_has_ventas
    ADD CONSTRAINT productos_has_ventas_pkey PRIMARY KEY (phv_id);


--
-- TOC entry 4977 (class 2606 OID 16698)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (prod_id);


--
-- TOC entry 4999 (class 2606 OID 41607)
-- Name: proveedores proveedores_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.proveedores
    ADD CONSTRAINT proveedores_pkey PRIMARY KEY (prov_id);


--
-- TOC entry 5001 (class 2606 OID 41609)
-- Name: proveedores proveedores_prov_nombre_key; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.proveedores
    ADD CONSTRAINT proveedores_prov_nombre_key UNIQUE (prov_nombre);


--
-- TOC entry 4983 (class 2606 OID 41655)
-- Name: productos_has_ventas uk_phv_ven_prod; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.productos_has_ventas
    ADD CONSTRAINT uk_phv_ven_prod UNIQUE (ven_id, prod_id);


--
-- TOC entry 4985 (class 2606 OID 16700)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usu_id);


--
-- TOC entry 4987 (class 2606 OID 16702)
-- Name: usuarios usuarios_usu_email_key; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.usuarios
    ADD CONSTRAINT usuarios_usu_email_key UNIQUE (usu_email);


--
-- TOC entry 4990 (class 2606 OID 16704)
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (ven_id);


--
-- TOC entry 5006 (class 1259 OID 41651)
-- Name: idx_chp_cpr_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_chp_cpr_id ON aqua_nova.compra_has_productos USING btree (cpr_id);


--
-- TOC entry 5007 (class 1259 OID 41652)
-- Name: idx_chp_prod_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_chp_prod_id ON aqua_nova.compra_has_productos USING btree (prod_id);


--
-- TOC entry 4993 (class 1259 OID 41624)
-- Name: idx_compras_prov_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_compras_prov_id ON aqua_nova.compras USING btree (prov_id);


--
-- TOC entry 5010 (class 1259 OID 41714)
-- Name: idx_facturas_estado; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_facturas_estado ON aqua_nova.facturas USING btree (fac_estado);


--
-- TOC entry 5011 (class 1259 OID 41716)
-- Name: idx_facturas_fecha; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_facturas_fecha ON aqua_nova.facturas USING btree (fac_fecha);


--
-- TOC entry 5012 (class 1259 OID 41715)
-- Name: idx_facturas_lote; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_facturas_lote ON aqua_nova.facturas USING btree (fac_lote_id);


--
-- TOC entry 5013 (class 1259 OID 41713)
-- Name: idx_facturas_referencia; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_facturas_referencia ON aqua_nova.facturas USING btree (fac_referencia_id);


--
-- TOC entry 5014 (class 1259 OID 41712)
-- Name: idx_facturas_tipo; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_facturas_tipo ON aqua_nova.facturas USING btree (fac_tipo);


--
-- TOC entry 4978 (class 1259 OID 41657)
-- Name: idx_phv_prod_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_phv_prod_id ON aqua_nova.productos_has_ventas USING btree (prod_id);


--
-- TOC entry 4979 (class 1259 OID 41656)
-- Name: idx_phv_ven_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_phv_ven_id ON aqua_nova.productos_has_ventas USING btree (ven_id);


--
-- TOC entry 4975 (class 1259 OID 41617)
-- Name: idx_productos_prov_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_productos_prov_id ON aqua_nova.productos USING btree (prov_id);


--
-- TOC entry 4996 (class 1259 OID 41611)
-- Name: idx_proveedores_estado; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_proveedores_estado ON aqua_nova.proveedores USING btree (prov_estado);


--
-- TOC entry 4997 (class 1259 OID 41610)
-- Name: idx_proveedores_nombre; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_proveedores_nombre ON aqua_nova.proveedores USING btree (prov_nombre);


--
-- TOC entry 4988 (class 1259 OID 41663)
-- Name: idx_ventas_cli_id; Type: INDEX; Schema: aqua_nova; Owner: postgres
--

CREATE INDEX idx_ventas_cli_id ON aqua_nova.ventas USING btree (cli_id);


--
-- TOC entry 5037 (class 2620 OID 41718)
-- Name: compras trg_create_factura_compra; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_create_factura_compra AFTER INSERT ON aqua_nova.compras FOR EACH ROW EXECUTE FUNCTION aqua_nova.create_factura_on_compra_insert();


--
-- TOC entry 5036 (class 2620 OID 41720)
-- Name: ventas trg_create_factura_venta; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_create_factura_venta AFTER INSERT ON aqua_nova.ventas FOR EACH ROW EXECUTE FUNCTION aqua_nova.create_factura_on_venta_insert();


--
-- TOC entry 5026 (class 2620 OID 41665)
-- Name: clientes trg_sync_cliente_rol_insert; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_sync_cliente_rol_insert BEFORE INSERT ON aqua_nova.clientes FOR EACH ROW EXECUTE FUNCTION aqua_nova.sync_cliente_rol_on_insert();


--
-- TOC entry 5027 (class 2620 OID 41667)
-- Name: clientes trg_sync_cliente_rol_update; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_sync_cliente_rol_update BEFORE UPDATE ON aqua_nova.clientes FOR EACH ROW EXECUTE FUNCTION aqua_nova.sync_cliente_rol_on_update();


--
-- TOC entry 5033 (class 2620 OID 41673)
-- Name: usuarios trg_sync_clientes_rol_usuario; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_sync_clientes_rol_usuario AFTER UPDATE ON aqua_nova.usuarios FOR EACH ROW EXECUTE FUNCTION aqua_nova.sync_clientes_rol_on_usuario_update();


--
-- TOC entry 5028 (class 2620 OID 41669)
-- Name: empleados trg_sync_empleado_rol_insert; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_sync_empleado_rol_insert BEFORE INSERT ON aqua_nova.empleados FOR EACH ROW EXECUTE FUNCTION aqua_nova.sync_empleado_rol_on_insert();


--
-- TOC entry 5029 (class 2620 OID 41671)
-- Name: empleados trg_sync_empleado_rol_update; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_sync_empleado_rol_update BEFORE UPDATE ON aqua_nova.empleados FOR EACH ROW EXECUTE FUNCTION aqua_nova.sync_empleado_rol_on_update();


--
-- TOC entry 5034 (class 2620 OID 41675)
-- Name: usuarios trg_sync_empleados_rol_usuario; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_sync_empleados_rol_usuario AFTER UPDATE ON aqua_nova.usuarios FOR EACH ROW EXECUTE FUNCTION aqua_nova.sync_empleados_rol_on_usuario_update();


--
-- TOC entry 5038 (class 2620 OID 41681)
-- Name: compra_has_productos trg_update_stock_compra_delete; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_update_stock_compra_delete AFTER DELETE ON aqua_nova.compra_has_productos FOR EACH ROW EXECUTE FUNCTION aqua_nova.update_stock_on_compra_delete();


--
-- TOC entry 5039 (class 2620 OID 41677)
-- Name: compra_has_productos trg_update_stock_compra_insert; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_update_stock_compra_insert AFTER INSERT ON aqua_nova.compra_has_productos FOR EACH ROW EXECUTE FUNCTION aqua_nova.update_stock_on_compra_insert();


--
-- TOC entry 5040 (class 2620 OID 41679)
-- Name: compra_has_productos trg_update_stock_compra_update; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_update_stock_compra_update AFTER UPDATE ON aqua_nova.compra_has_productos FOR EACH ROW EXECUTE FUNCTION aqua_nova.update_stock_on_compra_update();


--
-- TOC entry 5030 (class 2620 OID 41687)
-- Name: productos_has_ventas trg_update_stock_venta_delete; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_update_stock_venta_delete AFTER DELETE ON aqua_nova.productos_has_ventas FOR EACH ROW EXECUTE FUNCTION aqua_nova.update_stock_on_venta_delete();


--
-- TOC entry 5031 (class 2620 OID 41683)
-- Name: productos_has_ventas trg_update_stock_venta_insert; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_update_stock_venta_insert AFTER INSERT ON aqua_nova.productos_has_ventas FOR EACH ROW EXECUTE FUNCTION aqua_nova.update_stock_on_venta_insert();


--
-- TOC entry 5032 (class 2620 OID 41685)
-- Name: productos_has_ventas trg_update_stock_venta_update; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_update_stock_venta_update AFTER UPDATE ON aqua_nova.productos_has_ventas FOR EACH ROW EXECUTE FUNCTION aqua_nova.update_stock_on_venta_update();


--
-- TOC entry 5035 (class 2620 OID 16982)
-- Name: usuarios trg_usuario_borrado; Type: TRIGGER; Schema: aqua_nova; Owner: postgres
--

CREATE TRIGGER trg_usuario_borrado AFTER DELETE ON aqua_nova.usuarios FOR EACH ROW EXECUTE FUNCTION aqua_nova.log_usuario_borrado();


--
-- TOC entry 5015 (class 2606 OID 16705)
-- Name: clientes clientes_usu_id_fkey; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.clientes
    ADD CONSTRAINT clientes_usu_id_fkey FOREIGN KEY (usu_id) REFERENCES aqua_nova.usuarios(usu_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5016 (class 2606 OID 16735)
-- Name: empleados empleados_usu_id_fkey; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.empleados
    ADD CONSTRAINT empleados_usu_id_fkey FOREIGN KEY (usu_id) REFERENCES aqua_nova.usuarios(usu_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 41641)
-- Name: compra_has_productos fk_chp_cpr_id; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compra_has_productos
    ADD CONSTRAINT fk_chp_cpr_id FOREIGN KEY (cpr_id) REFERENCES aqua_nova.compras(cpr_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 41646)
-- Name: compra_has_productos fk_chp_prod_id; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compra_has_productos
    ADD CONSTRAINT fk_chp_prod_id FOREIGN KEY (prod_id) REFERENCES aqua_nova.productos(prod_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 41619)
-- Name: compras fk_compras_prov_id; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.compras
    ADD CONSTRAINT fk_compras_prov_id FOREIGN KEY (prov_id) REFERENCES aqua_nova.proveedores(prov_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5025 (class 2606 OID 41707)
-- Name: facturas fk_facturas_usu_id; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.facturas
    ADD CONSTRAINT fk_facturas_usu_id FOREIGN KEY (usu_id) REFERENCES aqua_nova.usuarios(usu_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5017 (class 2606 OID 41612)
-- Name: productos fk_productos_prov_id; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.productos
    ADD CONSTRAINT fk_productos_prov_id FOREIGN KEY (prov_id) REFERENCES aqua_nova.proveedores(prov_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5020 (class 2606 OID 41658)
-- Name: ventas fk_ventas_cli_id; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.ventas
    ADD CONSTRAINT fk_ventas_cli_id FOREIGN KEY (cli_id) REFERENCES aqua_nova.clientes(cli_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5018 (class 2606 OID 16755)
-- Name: productos_has_ventas productos_has_ventas_prod_id_fkey; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.productos_has_ventas
    ADD CONSTRAINT productos_has_ventas_prod_id_fkey FOREIGN KEY (prod_id) REFERENCES aqua_nova.productos(prod_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5019 (class 2606 OID 16760)
-- Name: productos_has_ventas productos_has_ventas_ven_id_fkey; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.productos_has_ventas
    ADD CONSTRAINT productos_has_ventas_ven_id_fkey FOREIGN KEY (ven_id) REFERENCES aqua_nova.ventas(ven_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 16765)
-- Name: ventas ventas_usu_id_fkey; Type: FK CONSTRAINT; Schema: aqua_nova; Owner: postgres
--

ALTER TABLE ONLY aqua_nova.ventas
    ADD CONSTRAINT ventas_usu_id_fkey FOREIGN KEY (usu_id) REFERENCES aqua_nova.usuarios(usu_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2026-11-17 20:46:48

--
-- PostgreSQL database dump complete
--

\unrestrict b78oYpj76w6BgYZddQciKjwUiMlSLj7Ogwt8twqu2tx75U62iaL5whJ7KlVQKeG

