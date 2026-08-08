package aeris_island.backend.controller;

import aeris_island.backend.dto.BillRequest;
import aeris_island.backend.entity.Bill;
import aeris_island.backend.repository.BillRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin
public class BillController {

    private final BillRepository billRepository;

    public BillController(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @PostMapping
    public Bill saveBill(@RequestBody BillRequest request) {
        Bill bill = new Bill();
        bill.setSubtotal(request.getSubtotal());
        bill.setCreatedAt(LocalDateTime.now());
        return billRepository.save(bill);
    }
}