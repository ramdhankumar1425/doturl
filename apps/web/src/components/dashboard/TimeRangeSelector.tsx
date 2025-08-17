"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type TimeRange = "30d" | "7d" | "24h";

interface TimeRangeSelectorProps {
	value?: TimeRange;
	onChange?: (value: TimeRange) => void;
	liveMode?: boolean;
	onLiveModeChange?: (value: boolean) => void;
}

export default function TimeRangeSelector({
	value = "7d",
	onChange,
	liveMode = false,
	onLiveModeChange,
}: TimeRangeSelectorProps) {
	const [selected, setSelected] = useState<TimeRange>(value);
	const [isLive, setIsLive] = useState(liveMode);

	const handleSelect = (range: TimeRange) => {
		setSelected(range);
		onChange?.(range);
	};

	const handleLiveToggle = (checked: boolean) => {
		setIsLive(checked);
		onLiveModeChange?.(checked);
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="flex gap-2">
				<Button
					variant={selected === "30d" ? "default" : "outline"}
					size="sm"
					onClick={() => handleSelect("30d")}
				>
					Last 30 Days
				</Button>
				<Button
					variant={selected === "7d" ? "default" : "outline"}
					size="sm"
					onClick={() => handleSelect("7d")}
				>
					Last 7 Days
				</Button>
				<Button
					variant={selected === "24h" ? "default" : "outline"}
					size="sm"
					onClick={() => handleSelect("24h")}
				>
					Last 24 Hours
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<Label
					htmlFor="live-mode"
					className="text-sm text-gray-600"
				>
					Live Mode
				</Label>
				<Switch
					id="live-mode"
					checked={isLive}
					onCheckedChange={handleLiveToggle}
				/>
			</div>
		</div>
	);
}
