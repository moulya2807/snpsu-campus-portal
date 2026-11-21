import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { GeminiService } from '../services/geminiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  isMockFallback?: boolean;
}

export const AIAssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'gemini',
      text: "🎓 **Welcome to SNPSU AI Academic & Condonation Advisor!**\n\nI am powered by **Google AI Studio (Gemini 2.0 Flash)**. I can analyze student attendance trends, compute condonation likelihood under UGC/AICTE norms, and verify OD/Medical documentation.",
      timestamp: '19:42',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [customKey, setCustomKey] = useState<string>(GeminiService.getApiKey());
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    const systemInstruction = 
      "You are the official ERP & Academic Regulations AI Advisor for Sapthagiri NPS University (SNPSU), Bengaluru. " +
      "You are familiar with the Choice Based Credit System (CBCS), 75% UGC/AICTE mandatory attendance criteria, " +
      "65-74% Condonation window with Medical/OD certificate, <65% Detained status, and hospital ward clinical postings. " +
      "Provide authoritative, concise, and structured guidance.";

    try {
      const response = await GeminiService.queryGemini(query, systemInstruction);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMockFallback: response.isMockFallback,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    GeminiService.setApiKey(customKey);
    setShowKeyInput(false);
  };

  return (
    <View style={styles.container}>
      {/* Google AI Studio Status Banner */}
      <View style={styles.apiKeyBanner}>
        <View style={styles.apiInfo}>
          <Text style={styles.apiLabel}>Google AI Studio (Gemini API)</Text>
          <Text style={styles.apiSub}>
            {customKey ? 'Active Key Configured' : 'Using SNPSU Intelligent ERP Heuristics'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.keyToggleBtn}
          onPress={() => setShowKeyInput(!showKeyInput)}
        >
          <Text style={styles.keyToggleText}>{showKeyInput ? 'Hide' : 'Configure Key'}</Text>
        </TouchableOpacity>
      </View>

      {/* Optional Google AI Studio Key Entry */}
      {showKeyInput && (
        <View style={styles.keyInputBox}>
          <Text style={styles.keyHint}>
            Get a free Gemini API key from <Text style={styles.boldText}>aistudio.google.com</Text> and paste here:
          </Text>
          <View style={styles.keyInputRow}>
            <TextInput
              style={styles.keyTextInput}
              placeholder="AIzaSy..."
              placeholderTextColor="#94A3B8"
              value={customKey}
              onChangeText={setCustomKey}
              secureTextEntry
            />
            <TouchableOpacity style={styles.saveKeyBtn} onPress={handleSaveApiKey}>
              <Text style={styles.saveKeyText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Suggested Quick Prompts */}
      <View style={styles.quickPrompts}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsRow}>
          <TouchableOpacity
            style={styles.promptChip}
            onPress={() => handleSend("Explain SNPSU 75% attendance condonation criteria under UGC regulations.")}
          >
            <Text style={styles.promptChipText}>📜 Condonation Rules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.promptChip}
            onPress={() => handleSend("Student 1SN24CS005 has 62% attendance. Can they get condoned with medical certificate?")}
          >
            <Text style={styles.promptChipText}>🏥 62% Medical Waiver Check</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.promptChip}
            onPress={() => handleSend("How does a 2-hour lab block get weighted in CBCS period attendance calculation?")}
          >
            <Text style={styles.promptChipText}>⏱️ Lab Period Weighting</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <View
              key={m.id}
              style={[
                styles.bubbleWrapper,
                isUser ? styles.userBubbleWrapper : styles.geminiBubbleWrapper,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.userBubble : styles.geminiBubble,
                ]}
              >
                {!isUser && (
                  <View style={styles.geminiBadgeRow}>
                    <Text style={styles.geminiBadge}>SNPSU Gemini 2.0 Flash</Text>
                    {m.isMockFallback && (
                      <Text style={styles.mockBadge}>Offline ERP Mode</Text>
                    )}
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.geminiText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text style={styles.timeText}>{m.timestamp}</Text>
              </View>
            </View>
          );
        })}
        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Gemini is analyzing SNPSU academic data...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Ask Gemini about attendance, OD approvals, regulations..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  apiKeyBanner: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  apiInfo: {
    flex: 1,
  },
  apiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  apiSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  keyToggleBtn: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keyToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  keyInputBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  keyHint: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primary,
  },
  keyInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keyTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
  },
  saveKeyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 6,
  },
  saveKeyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  quickPrompts: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: 8,
  },
  promptsRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
  },
  userBubbleWrapper: {
    justifyContent: 'flex-end',
  },
  geminiBubbleWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 12,
    padding: 12,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  geminiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  geminiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  geminiBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentMaroon,
  },
  mockBadge: {
    fontSize: 9,
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    color: colors.textMuted,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userText: {
    color: '#FFFFFF',
  },
  geminiText: {
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 9,
    color: colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    maxHeight: 80,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
