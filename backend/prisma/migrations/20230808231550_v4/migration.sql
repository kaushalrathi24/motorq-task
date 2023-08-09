-- CreateTable
CREATE TABLE "_ApproverToRequest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ApproverToRequest_AB_unique" ON "_ApproverToRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_ApproverToRequest_B_index" ON "_ApproverToRequest"("B");

-- AddForeignKey
ALTER TABLE "_ApproverToRequest" ADD CONSTRAINT "_ApproverToRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "Approver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApproverToRequest" ADD CONSTRAINT "_ApproverToRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
