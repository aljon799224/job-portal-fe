import { useEffect } from "react";

export function useAutoHideToast(
	isVisible: boolean,
	setIsVisible: (value: boolean) => void,
	duration: number = 3000
) {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [isVisible, setIsVisible, duration]);
}
