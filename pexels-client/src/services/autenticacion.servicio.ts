import axios from "axios";

const API_BASE_URL = "https://airfilms-server.onrender.com/api";

/**
 * Interfaz para la respuesta de autenticación del backend.
 */
interface RespuestaAutenticacion {
  message: string;
  token?: string;
  userId?: string;
}

/**
 * Interfaz para la respuesta de verificación de token.
 */
interface RespuestaVerificacion {
  success: boolean;
  user?: {
    id: string;
  };
}

/**
 * Interfaz para el perfil de usuario completo.
 */
interface PerfilUsuario {
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
 * Interfaz para datos de registro.
 */
interface DatosRegistro {
  name: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
}

/**
 * Interfaz para datos de login.
 */
interface DatosLogin {
  email: string;
  password: string;
}

/**
 * Interfaz para actualizar perfil.
 */
interface DatosActualizarPerfil {
  name?: string;
  lastName?: string;
  age?: number;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

/**
 * Servicio para manejar todas las operaciones de autenticación.
 * Conecta con el backend de AirFilms en Render.
 */
export const servicioAutenticacion = {
  /**
   * Registra un nuevo usuario.
   * POST /api/auth/register
   * 
   * Validaciones del backend:
   * - Todos los campos son obligatorios
   * - Edad >= 13 años
   * - Email válido
   * - Contraseña: min 8 chars, 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial
   */
  registrar: async (datos: DatosRegistro): Promise<RespuestaAutenticacion> => {
    try {
      const respuesta = await axios.post(`${API_BASE_URL}/auth/register`, datos);
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al registrar:", error);
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  },

  /**
   * Inicia sesión de un usuario.
   * POST /api/auth/login
   * 
   * Respuesta exitosa incluye:
   * - token: JWT válido por 24 horas
   * - message: "Inicio de sesión exitoso."
   */
  iniciarSesion: async (datos: DatosLogin): Promise<RespuestaAutenticacion> => {
    try {
      const respuesta = await axios.post(`${API_BASE_URL}/auth/login`, datos);
      
      if (respuesta.data.token) {
        localStorage.setItem("airfilms_token", respuesta.data.token);
      }
      
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  },

  /**
   * Cierra la sesión del usuario.
   * POST /api/auth/logout
   * 
   * Requiere: Authorization Bearer token
   */
  cerrarSesion: async (): Promise<void> => {
    try {
      const token = localStorage.getItem("airfilms_token");
      
      if (token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      
      localStorage.removeItem("airfilms_token");
      localStorage.removeItem("airfilms_usuario");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      // Limpiar local storage de todas formas
      localStorage.removeItem("airfilms_token");
      localStorage.removeItem("airfilms_usuario");
    }
  },

  /**
   * Solicita recuperación de contraseña.
   * POST /api/auth/forgot-password
   * 
   * Envía un email con enlace de restablecimiento válido por 1 hora.
   */
  olvidarContraseña: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const respuesta = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al solicitar recuperación:", error);
      throw new Error(
        error.response?.data?.message || "Error al solicitar recuperación de contraseña"
      );
    }
  },

  /**
   * Restablece la contraseña con el token.
   * POST /api/auth/reset-password
   * 
   * Validación: min 8 chars, 1 mayúscula, 1 número, 1 carácter especial
   */
  restablecerContraseña: async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const respuesta = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al restablecer contraseña:", error);
      throw new Error(
        error.response?.data?.message || "Error al restablecer contraseña"
      );
    }
  },

  /**
   * Verifica si el token actual es válido.
   * GET /api/auth/verify-auth
   * 
   * Requiere: Authorization Bearer token
   */
  verificarAutenticacion: async (): Promise<RespuestaVerificacion> => {
    try {
      const token = localStorage.getItem("airfilms_token");
      
      if (!token) {
        return { success: false };
      }

      const respuesta = await axios.get(`${API_BASE_URL}/auth/verify-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al verificar autenticación:", error);
      // Si el token es inválido, limpiar
      localStorage.removeItem("airfilms_token");
      localStorage.removeItem("airfilms_usuario");
      return { success: false };
    }
  },

  /**
   * Obtiene el perfil del usuario autenticado.
   * GET /api/users/profile
   * 
   * Requiere: Authorization Bearer token
   * Retorna: PerfilUsuario completo
   */
  obtenerPerfil: async (): Promise<{ success: boolean; user: PerfilUsuario }> => {
    try {
      const token = localStorage.getItem("airfilms_token");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const respuesta = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al obtener perfil:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener perfil de usuario"
      );
    }
  },

  /**
   * Actualiza el perfil del usuario autenticado.
   * PUT /api/users/profile
   * 
   * Requiere: Authorization Bearer token
   * Puede actualizar: name, lastName, age, email, password
   */
  actualizarPerfil: async (datos: DatosActualizarPerfil): Promise<{ success: boolean; user: PerfilUsuario; message: string }> => {
    try {
      const token = localStorage.getItem("airfilms_token");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const respuesta = await axios.put(
        `${API_BASE_URL}/users/profile`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      throw new Error(
        error.response?.data?.message || "Error al actualizar perfil"
      );
    }
  },

  /**
   * Elimina (soft delete) la cuenta del usuario.
   * DELETE /api/users/profile
   * 
   * Requiere: Authorization Bearer token
   * La cuenta queda marcada como isDeleted: true
   */
  eliminarCuenta: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem("airfilms_token");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const respuesta = await axios.delete(`${API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Limpiar storage después de eliminar
      localStorage.removeItem("airfilms_token");
      localStorage.removeItem("airfilms_usuario");
      
      return respuesta.data;
    } catch (error: any) {
      console.error("Error al eliminar cuenta:", error);
      throw new Error(
        error.response?.data?.message || "Error al eliminar cuenta"
      );
    }
  },
};

export default servicioAutenticacion;