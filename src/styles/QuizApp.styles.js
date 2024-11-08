import styled, { keyframes } from 'styled-components';
import { Layout, Card, Radio, Button } from 'antd';

const { Header, Content } = Layout;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
`;

export const StyledHeader = styled(Header)`
  background: white;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  position: fixed;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  
  .logo {
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
    margin-right: 48px;
  }
  
  .ant-menu {
    flex: 1;
    border-bottom: none;
    line-height: 64px;
  }
`;

export const StyledContent = styled(Content)`
  padding: 88px 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const QuizCard = styled(Card)`
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(24,144,255,0.1);
  background: white;
  overflow: hidden;
  
  .ant-card-body {
    padding: 32px;
  }
  
  .quiz-title {
    text-align: center;
    margin-bottom: 32px;
    color: #1890ff;
    font-size: 24px;
    font-weight: 600;
  }
`;

export const GradeWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 32px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const GradeSection = styled.section`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  .grade-title {
    font-size: 20px;
    color: #333;
    margin-bottom: 24px;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, #1890ff 0%, #69c0ff 100%);
      border-radius: 3px;
    }
  }
`;

export const TermButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

export const TermButton = styled(Button)`
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24,144,255,0.15);
  }
  
  &.selected {
    background: linear-gradient(135deg, #1890ff 0%, #69c0ff 100%);
    border: none;
    color: white;
  }
`;

export const DifficultyCard = styled(Card)`
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  border: 2px solid ${props => props.selected ? '#1890ff' : '#f0f0f0'};
  background: ${props => props.selected ? '#f0f7ff' : 'white'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(24,144,255,0.15);
  }

  .difficulty-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .difficulty-icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      background: ${props => 
        props.level === 'EASY' ? '#f6ffed' :
        props.level === 'MEDIUM' ? '#e6f7ff' : 
        '#fff1f0'};
      color: ${props =>
        props.level === 'EASY' ? '#52c41a' :
        props.level === 'MEDIUM' ? '#1890ff' :
        '#f5222d'};
    }
    
    .difficulty-title {
      font-size: 18px;
      font-weight: 600;
      color: ${props =>
        props.level === 'EASY' ? '#52c41a' :
        props.level === 'MEDIUM' ? '#1890ff' :
        '#f5222d'};
    }
  }
  
  .difficulty-desc {
    color: #666;
    margin-bottom: 16px;
    min-height: 48px;
  }
  
  .difficulty-info {
    background: #fafafa;
    padding: 12px;
    border-radius: 8px;
    
    li {
      color: #666;
      margin: 8px 0;
      display: flex;
      align-items: center;
      
      &:before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #1890ff;
        margin-right: 8px;
      }
    }
  }
`;

export const QuestionCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  .question-header {
    margin-bottom: 32px;
  }

  .question-progress {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;
    text-align: right;
  }

  .question-prompt {
    color: #333;
    font-size: 18px;
    margin-bottom: 24px;
    text-align: center;
  }

  .poem-info {
    text-align: center;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    
    .poem-title {
      font-size: 24px;
      font-weight: bold;
      color: #1890ff;
      margin-bottom: 16px;
    }
    
    .poem-meta {
      margin-bottom: 24px;
      
      .dynasty {
        color: #666;
        margin-right: 12px;
        font-size: 16px;
      }
      
      .author {
        color: #666;
        font-size: 16px;
      }
    }
    
    .poem-content {
      .poem-line {
        font-size: 18px;
        line-height: 2;
        color: #333;
        
        &:empty {
          height: 36px;
          background: #e6f7ff;
          border-radius: 4px;
          margin: 8px 0;
        }
      }
    }
  }
`;

export const OptionsWrapper = styled(Radio.Group)`
  width: 100%;
  margin-top: 32px;
  
  .ant-radio-wrapper {
    width: 100%;
    margin: 0;
    padding: 16px 20px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1890ff;
      background: #f0f5ff;
    }
    
    &.ant-radio-wrapper-checked {
      background: #e6f7ff;
      border-color: #1890ff;
    }
  }

  .option-text {
    font-size: 16px;
    margin-left: 8px;
  }
`;

export const ResultCard = styled(Card)`
  text-align: center;
  padding: 48px;
  
  .result-title {
    font-size: 32px;
    color: #333;
    margin-bottom: 32px;
  }
  
  .score-display {
    font-size: 64px;
    font-weight: bold;
    background: linear-gradient(135deg, #1890ff 0%, #69c0ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 24px 0;
  }
  
  .feedback-message {
    font-size: 20px;
    margin: 24px 0;
    padding: 16px 32px;
    border-radius: 12px;
    display: inline-block;
    
    &.perfect {
      background: #f6ffed;
      color: #52c41a;
      border: 1px solid #b7eb8f;
    }
    
    &.good {
      background: #e6f7ff;
      color: #1890ff;
      border: 1px solid #91d5ff;
    }
    
    &.needImprove {
      background: #fff2f0;
      color: #ff4d4f;
      border: 1px solid #ffccc7;
    }
  }
  
  .action-buttons {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 16px;
  }
`; 