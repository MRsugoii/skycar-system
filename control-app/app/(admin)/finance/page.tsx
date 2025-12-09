

import { Suspense } from "react";
import FinanceContent from "@/components/FinanceContent";

export default function FinancePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FinanceContent />
        </Suspense>
    );
}
