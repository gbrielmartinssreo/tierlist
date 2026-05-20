import { ActivityLog } from '../types';
import { formatDate } from '../utils/storage';
import '../styles/ActivityPanel.css';

interface ActivityPanelProps {
  activities: ActivityLog[];
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities }) => {
  const sortedActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <h3>📝 Registro de Atividades</h3>
        <p className="activity-count">Total: {activities.length}</p>
      </div>

      <div className="activity-list">
        {sortedActivities.length === 0 ? (
          <p className="empty-message">Nenhuma atividade registrada ainda</p>
        ) : (
          sortedActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-main">
                <strong className="activity-user">{activity.userName}</strong>
                <span className="activity-action">{activity.action}</span>
              </div>
              <div className="activity-time">
                {formatDate(activity.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
