import { getSupabase } from '../config/supabaseClient.js';

export const getUserByUsername = async (username) => {
  const sanitizedUsername = (username ?? '').trim();
  if (!sanitizedUsername) return null;

  try {
    const supabase = getSupabase();
    // Use exact match for username (case-insensitive)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', sanitizedUsername);

    if (error) {
      console.error('[USER_MODEL] Erro ao buscar usuário por username:', error);
      throw error;
    }

    // Retorna o primeiro resultado ou null se não encontrou
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('[USER_MODEL] Exceção em getUserByUsername:', err?.message || err);
    throw err;
  }
};

export const createUser = async (username, password, role = 'user', email = null) => {
  const sanitizedUsername = (username ?? '').trim();
  if (!sanitizedUsername) throw new Error('Nome de usuário obrigatório');

  try {
    console.log('[USER_MODEL] Criando usuário:', { username: sanitizedUsername, email, role });
    const supabase = getSupabase();
    const resp = await supabase
      .from('users')
      .insert([{ username: sanitizedUsername, password, role, email }])
      .select();

    // resp can be { data, error }
    const { data, error } = resp;
    if (error) {
      console.error('[USER_MODEL] Erro ao criar usuário (supabase):', error);
      throw error;
    }
    if (!data || data.length === 0) {
      console.error('[USER_MODEL] createUser retornou sem dados:', resp);
      throw new Error('Falha ao criar usuário: resposta vazia do banco');
    }
    console.log('[USER_MODEL] Usuário criado com sucesso:', { id: data[0].id, username: data[0].username });
    return data[0];
  } catch (err) {
    console.error('[USER_MODEL] Exceção em createUser:', err?.message || err, err);
    throw err;
  }
};
