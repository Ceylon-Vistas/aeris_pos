package aeris_island.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class BillRequest {

    private List<BillItemRequest> items;

    private BigDecimal subtotal;
}