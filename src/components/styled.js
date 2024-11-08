export const DifficultyCard = styled.div`
  padding: 16px;
  border: 1px solid ${props => props.selected ? '#1890ff' : '#d9d9d9'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: ${props => props.selected ? '#e6f7ff' : '#fff'};
  
  &:hover {
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  h3 {
    color: #1890ff;
    margin-bottom: 8px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 8px 0 0;
    
    li {
      color: #666;
      font-size: 14px;
      margin: 4px 0;
    }
  }
`; 