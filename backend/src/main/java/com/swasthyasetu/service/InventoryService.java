package com.swasthyasetu.service;

import com.swasthyasetu.dto.DiagnosticDto.DiagnosticEquipmentDto;
import com.swasthyasetu.dto.MedicineDto.MedicineStockDto;
import com.swasthyasetu.entity.Medicine;
import com.swasthyasetu.entity.MedicineStock;
import com.swasthyasetu.entity.enums.EquipmentStatus;
import com.swasthyasetu.exception.ResourceNotFoundException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.MedicineRepository;
import com.swasthyasetu.repository.MedicineStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final MedicineRepository medicineRepository;
    private final MedicineStockRepository stockRepository;
    private final EntityDtoMapper mapper;

    public InventoryService(MedicineRepository medicineRepository,
                            MedicineStockRepository stockRepository,
                            EntityDtoMapper mapper) {
        this.medicineRepository = medicineRepository;
        this.stockRepository = stockRepository;
        this.mapper = mapper;
    }

    public List<MedicineStockDto> getAllStock() {
        return stockRepository.findAll().stream()
                .map(mapper::toStockDto)
                .collect(Collectors.toList());
    }

    public List<MedicineStockDto> getFacilityStock(String facilityId) {
        return stockRepository.findByFacilityId(facilityId).stream()
                .map(mapper::toStockDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicineStockDto updateStock(String stockId, int newQuantity) {
        MedicineStock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine stock record not found: " + stockId));
        stock.setQuantity(newQuantity);
        stockRepository.save(stock);
        return mapper.toStockDto(stock);
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findByActiveTrue();
    }

    public List<DiagnosticEquipmentDto> getDiagnosticEquipment() {
        // Essential diagnostic infrastructure monitor for PHC
        List<DiagnosticEquipmentDto> list = new ArrayList<>();

        DiagnosticEquipmentDto eq1 = new DiagnosticEquipmentDto();
        eq1.setId("eq-1");
        eq1.setName("Automated Hematology Analyzer (CBC)");
        eq1.setCategory("Pathology Lab");
        eq1.setStatus(EquipmentStatus.FUNCTIONAL);
        eq1.setTurnaroundTimeHours(2);
        eq1.setPendingReportsCount(4);
        eq1.setFacilityId("fac-phc-junnar");
        eq1.setFacilityName("PHC Junnar, Pune");
        list.add(eq1);

        DiagnosticEquipmentDto eq2 = new DiagnosticEquipmentDto();
        eq2.setId("eq-2");
        eq2.setName("12-Lead ECG Machine (Tele-cardiology)");
        eq2.setCategory("Cardiology");
        eq2.setStatus(EquipmentStatus.FUNCTIONAL);
        eq2.setTurnaroundTimeHours(1);
        eq2.setPendingReportsCount(1);
        eq2.setFacilityId("fac-phc-junnar");
        eq2.setFacilityName("PHC Junnar, Pune");
        list.add(eq2);

        DiagnosticEquipmentDto eq3 = new DiagnosticEquipmentDto();
        eq3.setId("eq-3");
        eq3.setName("Semi-Auto Biochemistry Analyzer (LFT/KFT)");
        eq3.setCategory("Biochemistry");
        eq3.setStatus(EquipmentStatus.MAINTENANCE);
        eq3.setTurnaroundTimeHours(6);
        eq3.setPendingReportsCount(12);
        eq3.setFacilityId("fac-phc-junnar");
        eq3.setFacilityName("PHC Junnar, Pune");
        list.add(eq3);

        DiagnosticEquipmentDto eq4 = new DiagnosticEquipmentDto();
        eq4.setId("eq-4");
        eq4.setName("Digital X-Ray Unit (Chest & Bone)");
        eq4.setCategory("Radiology");
        eq4.setStatus(EquipmentStatus.FUNCTIONAL);
        eq4.setTurnaroundTimeHours(3);
        eq4.setPendingReportsCount(3);
        eq4.setFacilityId("fac-phc-junnar");
        eq4.setFacilityName("PHC Junnar, Pune");
        list.add(eq4);

        return list;
    }
}
