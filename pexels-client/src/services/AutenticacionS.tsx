import React, { createContext, useContext, useState, useEffect } from "react";
import servicioAutenticacion from "../services/autenticacion.servicio";

/**
 * Tipo para el usuario autenticado (perfil completo del backend).
 */
interface Usuario {
  id: string;
  name: string;
  lastName: string;
  age: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

/**
 * Tipo para el contexto de autenticación.
 */
interface ContextoAutenticacion {
  usuario: Usuario | null;
  estaAutenticado: boolean;
  estaCargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<boolean>;
  cerrarSesion: () => Promise<void>;
  registrarse: (name: string, lastName: string, age: number, email: string, password: string) => Promise<boolean>;
  verificarSesion: () => Promise<void>;
  cargarPerfil: () => Promise<void>;
}

const AutenticacionContexto = createContext<ContextoAutenticacion | undefined>(undefined);

/**
 * Proveedor del contexto de autenticación.
 * Maneja el estado de sesión del usuario con el backend real.
 * 
 * @component
 */
export const ProveedorAutenticacion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [estaCargando, setEstaCargando] = useState(true);

  /**
   * Carga el perfil completo del usuario desde el backend.
   */
  const cargarPerfil = async () => {
    try {
      const respuesta = await servicioAutenticacion.obtenerPerfil();
      
      if (respuesta.success && respuesta.user) {
        setUsuario(respuesta.user);
        localStorage.setItem("airfilms_usuario", JSON.stringify(respuesta.user));
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  /**
   * Verifica si hay una sesión activa al cargar la aplicación.
   */
  const verificarSesion = async () => {
    try {
      setEstaCargando(true);
      const token = localStorage.getItem("airfilms_token");
      
      if (!token) {
        setEstaCargando(false);
        return;
      }

      const respuesta = await servicioAutenticacion.verificarAutenticacion();
      
      if (respuesta.success && respuesta.user) {
        // Cargar perfil completo
        await cargarPerfil();
      } else {
        // Token inválido
        localStorage.removeItem("airfilms_token");
        localStorage.removeItem("airfilms_usuario");
        setUsuario(null);
      }
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      localStorage.removeItem("airfilms_token");
      localStorage.removeItem("airfilms_usuario");
      setUsuario(null);
    } finally {
      setEstaCargando(false);
    }
  };

  // Verificar sesión al montar el componente
  useEffect(() => {
    verificarSesion();
  }, []);

  /**
   * Inicia sesión del usuario con el backend.
   */
  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    try {
      setEstaCargando(true);
      const respuesta = await servicioAutenticacion.iniciarSesion({ email, password });
      
      if (respuesta.token) {
        // Cargar perfil completo después de login
        await cargarPerfil();
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      throw error; // Propagar para mostrar en UI
    } finally {
      setEstaCargando(false);
    }
  };

  /**
   * Cierra la sesión del usuario.
   */
  const cerrarSesion = async () => {
    try {
      setEstaCargando(true);
      await servicioAutenticacion.cerrarSesion();
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setEstaCargando(false);
    }
  };

  /**
   * Registra un nuevo usuario.
   */
  const registrarse = async (
    name: string,
    lastName: string,
    age: number,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setEstaCargando(true);
      const respuesta = await servicioAutenticacion.registrar({
        name,
        lastName,
        age,
        email,
        password,
      });
      
      if (respuesta.userId) {
        // Después de registrar, hacer login automático
        return await iniciarSesion(email, password);
      }
      
      return false;
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      throw error; // Propagar para mostrar en UI
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <AutenticacionContexto.Provider
      value={{
        usuario,
        estaAutenticado: !!usuario,
        estaCargando,
        iniciarSesion,
        cerrarSesion,
        registrarse,
        verificarSesion,
        cargarPerfil,
      }}
    >
      {children}
    </AutenticacionContexto.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación.
 */
export const useAutenticacion = () => {
  const contexto = useContext(AutenticacionContexto);
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion");
  }
  return contexto;
};