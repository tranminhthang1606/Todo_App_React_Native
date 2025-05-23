export const DateHelpers = {
    formatDate(date: Date): string {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    },

    formatDateTime(date: Date): string {
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    formatRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffDays > 0) {
            return `${diffDays} ngày trước`;
        } else if (diffHours > 0) {
            return `${diffHours} giờ trước`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} phút trước`;
        } else {
            return 'Vừa xong';
        }
    },

    isOverdue(date: Date): boolean {
        return date < new Date();
    },

    isDueToday(date: Date): boolean {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    },

    isDueTomorrow(date: Date): boolean {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
            date.getDate() === tomorrow.getDate() &&
            date.getMonth() === tomorrow.getMonth() &&
            date.getFullYear() === tomorrow.getFullYear()
        );
    },
};