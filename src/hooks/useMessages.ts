
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_gpt: boolean;
  user_id: string | null;
  profiles: {
    username: string;
  } | null;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_gpt,
          user_id,
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              is_gpt,
              user_id,
              profiles (
                username
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: content.trim(),
            user_id: user.id,
            is_gpt: false
          }
        ]);

      if (error) throw error;

      // Check if message starts with @gpt
      if (content.trim().toLowerCase().startsWith('@gpt')) {
        // Call OpenAI via Edge Function
        const gptPrompt = content.substring(4).trim();
        
        const { data, error: gptError } = await supabase.functions.invoke('chat-gpt', {
          body: { prompt: gptPrompt }
        });

        if (gptError) {
          console.error('GPT Error:', gptError);
          toast({
            title: "AI Error",
            description: "Failed to get response from ChatGPT",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};
